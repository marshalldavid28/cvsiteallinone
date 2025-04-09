
import html2canvas from "html2canvas";
import { PDFGeneratorState } from "./types";
import { setupNewPage } from "./fallbackGenerator";
import { processLeftColumn } from "./twoColumnProcessing";

/**
 * Process a section with page break check
 */
export async function processSectionWithPageBreakCheck(
  section: HTMLElement,
  state: PDFGeneratorState,
  theme: 'dark' | 'light'
): Promise<void> {
  // Create a clone to avoid modifying the original
  const sectionClone = section.cloneNode(true) as HTMLElement;
  document.body.appendChild(sectionClone);
  
  try {
    // Setup the clone for capture
    sectionClone.style.position = 'absolute';
    sectionClone.style.left = '-9999px';
    sectionClone.style.top = '0';
    sectionClone.style.width = `${state.rightColumnWidth! * 3.779528}px`; // Convert mm to px
    sectionClone.style.backgroundColor = state.bgColor;
    
    // Fix badge alignment in clone
    const badges = sectionClone.querySelectorAll('.badge');
    badges.forEach(badge => {
      if (badge instanceof HTMLElement) {
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.margin = '4px';
        badge.style.whiteSpace = 'nowrap';
      }
    });
    
    // Fix SVG icons display
    const svgIcons = sectionClone.querySelectorAll('svg');
    svgIcons.forEach(svg => {
      if (svg instanceof SVGElement) {
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = 'middle';
        svg.style.width = '16px';
        svg.style.height = '16px';
        svg.style.marginRight = '4px';
      }
    });
    
    // Fix span with icon alignment
    const iconSpans = sectionClone.querySelectorAll('.inline-flex');
    iconSpans.forEach(span => {
      if (span instanceof HTMLElement) {
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.gap = '6px';
        span.style.verticalAlign = 'middle';
      }
    });

    // Fix list spacing and display
    const lists = sectionClone.querySelectorAll('ul');
    lists.forEach(list => {
      if (list instanceof HTMLElement) {
        list.style.paddingLeft = '20px';
        list.style.marginTop = '8px';
        list.style.marginBottom = '8px';
      }
    });

    // Fix list item display
    const listItems = sectionClone.querySelectorAll('li');
    listItems.forEach((item, index) => {
      if (item instanceof HTMLElement) {
        item.style.display = 'list-item';
        item.style.marginLeft = '20px';
        item.style.position = 'relative';
        item.style.paddingLeft = '5px';
        
        // Add explicit bullet points if needed
        if (item.parentElement?.classList.contains('list-disc')) {
          const hasBullet = item.textContent?.trim().startsWith('•');
          if (!hasBullet) {
            const bullet = document.createElement('span');
            bullet.textContent = '• ';
            bullet.style.position = 'absolute';
            bullet.style.left = '-15px';
            item.insertBefore(bullet, item.firstChild);
          }
        }
      }
    });
    
    // Capture the section with improved quality settings
    const canvas = await html2canvas(sectionClone, {
      scale: 3, // Higher scale for better quality
      backgroundColor: state.bgColor,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    // Calculate dimensions
    const imgWidth = state.rightColumnWidth!;
    const ratio = canvas.height / canvas.width;
    const imgHeight = imgWidth * ratio;
    
    // Check if this section would overflow the page
    const remainingSpace = state.pageHeight - state.margin.bottom - state.yPosition;
    if (imgHeight > remainingSpace) {
      // Start a new page
      state.pdf.addPage();
      state.pageIndex++;
      setupNewPage(state, theme);
      
      // Re-add the left column on the new page (sidebar)
      if (state.leftColumnHeight) {
        const leftCol = document.querySelector('#cv-left-column');
        if (leftCol instanceof HTMLElement) {
          await processLeftColumn(leftCol, state, theme);
        }
      }
      
      // Reset y-position to top margin
      state.yPosition = state.margin.top;
    }
    
    // Check if section is too large for a single page
    if (imgHeight > state.pageHeight - state.margin.top - state.margin.bottom) {
      // This section is too large for a single page, we need to split it
      console.log("Section too large for a single page, splitting content");
      
      // Instead of trying to split the content, we'll scale it to fit
      const scaleFactor = (state.pageHeight - state.margin.top - state.margin.bottom) / imgHeight * 0.95;
      const scaledWidth = imgWidth * scaleFactor;
      const scaledHeight = imgHeight * scaleFactor;
      
      // Add scaled section to PDF
      state.pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        state.rightColumnX!,
        state.yPosition,
        scaledWidth,
        scaledHeight
      );
      
      // Update y-position for next section
      state.yPosition += scaledHeight + 5; // 5mm spacing between sections
    } else {
      // Add section to PDF
      state.pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        state.rightColumnX!,
        state.yPosition,
        imgWidth,
        imgHeight
      );
      
      // Update y-position for next section
      state.yPosition += imgHeight + 5; // 5mm spacing between sections
    }
  } finally {
    // Clean up the clone
    if (sectionClone.parentNode) {
      sectionClone.parentNode.removeChild(sectionClone);
    }
  }
}


import html2canvas from "html2canvas";
import { PDFGeneratorState } from "./types";
import { setupNewPage } from "./fallbackGenerator";

/**
 * Prepare a content element for screen capture by managing styles
 */
export const prepareContentForCapture = async (contentArea: Element): Promise<void> => {
  // Apply temporary class to the content area for PDF styling
  contentArea.classList.add('pdf-capture-in-progress');
  
  // Expand all "Show more" buttons to ensure all content is visible
  const showMoreButtons = contentArea.querySelectorAll('button[aria-expanded="false"]');
  for (const btn of showMoreButtons) {
    if (btn instanceof HTMLElement) {
      btn.click();
      // Wait a bit for any animations or content loading
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Hide elements that shouldn't be captured
  const elementsToHide = contentArea.querySelectorAll(
    '.fixed, .admin-controls, button[aria-label="Back to top"]'
  );
  
  elementsToHide.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.display = 'none';
    }
  });

  // Fix SVG icons and badges
  const svgIcons = contentArea.querySelectorAll('svg');
  svgIcons.forEach(svg => {
    if (svg.parentElement?.classList.contains('badge') || 
        svg.parentElement?.classList.contains('inline-flex')) {
      svg.style.display = 'inline-block';
      svg.style.verticalAlign = 'middle';
      svg.style.width = '16px';
      svg.style.height = '16px';
    }
  });
  
  // Fix list items and bullet points
  const listItems = contentArea.querySelectorAll('ul li');
  listItems.forEach(li => {
    if (li instanceof HTMLElement) {
      li.style.position = 'relative';
      li.style.paddingLeft = '15px';
      li.style.display = 'list-item';
      li.style.marginLeft = '20px';
    }
  });

  // Wait for any changes to apply
  await new Promise(resolve => setTimeout(resolve, 200));
}

/**
 * Clean up after PDF generation (remove any temporary styles)
 */
export const cleanupAfterCapture = (contentArea: Element): void => {
  contentArea.classList.remove('pdf-capture-in-progress');
}

/**
 * Capture a section and add it to the PDF
 */
export const captureAndAddToPDF = async (
  element: HTMLElement,
  state: PDFGeneratorState,
  theme: 'dark' | 'light',
  padding: number = 0
): Promise<{ newYPosition: number; newPageIndex: number }> => {
  try {
    // Deep clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    const tempContainer = document.createElement('div');
    tempContainer.classList.add('offscreen-render');
    
    // Apply theme-specific styles to the cloned element
    if (theme === 'dark') {
      tempContainer.classList.add('dark-theme-pdf');
      // Force dark theme for all text
      const textElements = clonedElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      textElements.forEach(el => {
        if (el instanceof HTMLElement) {
          if (!el.classList.contains('badge') && 
              !el.classList.contains('bg-brand-red') && 
              !el.classList.contains('text-brand-red')) {
            el.style.color = '#ffffff';
          }
        }
      });
      
      // Adjust background colors
      clonedElement.style.backgroundColor = '#0a0a0f';
      
      // Fix list bullets in dark mode
      const listItems = clonedElement.querySelectorAll('ul.list-disc li');
      listItems.forEach(li => {
        if (li instanceof HTMLElement) {
          li.style.position = 'relative';
          li.style.color = '#ffffff';
        }
      });
    }
    
    // Fix common rendering issues regardless of theme
    const svgElements = clonedElement.querySelectorAll('svg');
    svgElements.forEach(svg => {
      // Make sure SVGs render correctly
      svg.setAttribute('width', '16');
      svg.setAttribute('height', '16');
      svg.style.display = 'inline-block';
      svg.style.verticalAlign = 'middle';
    });
    
    const badgeElements = clonedElement.querySelectorAll('.badge');
    badgeElements.forEach(badge => {
      if (badge instanceof HTMLElement) {
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.padding = '2px 8px';
        badge.style.borderRadius = '4px';
        badge.style.margin = '2px';
      }
    });
    
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);
    
    // Set the element to its natural width but constrained to page width
    const maxWidth = state.pageWidth - state.margin.left - state.margin.right;
    clonedElement.style.width = `${maxWidth}mm`;
    clonedElement.style.maxWidth = `${maxWidth}mm`;
    
    // Temporarily position the element offscreen
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${maxWidth}mm`;
    
    // Capture the element
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: theme === 'dark' ? '#0a0a0f' : '#ffffff',
    });
    
    // Clean up
    document.body.removeChild(tempContainer);
    
    // Calculate dimensions and position
    const imgWidth = maxWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Check if the element would go beyond the page bounds
    if (state.yPosition + imgHeight + padding > state.pageHeight - state.margin.bottom) {
      // Add a new page
      state.pageIndex++;
      setupNewPage(state, theme);
      state.yPosition = state.margin.top; // Reset Y position to top of page
    }
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    state.pdf.addImage(
      imgData,
      'PNG',
      state.margin.left,
      state.yPosition,
      imgWidth,
      imgHeight
    );
    
    // Update y position for next element
    state.yPosition += imgHeight + padding;
    
    return {
      newYPosition: state.yPosition,
      newPageIndex: state.pageIndex
    };
  } catch (error) {
    console.error("Error capturing element for PDF:", error);
    // Return current state without modifications
    return {
      newYPosition: state.yPosition,
      newPageIndex: state.pageIndex
    };
  }
};

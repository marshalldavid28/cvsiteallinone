
import html2canvas from "html2canvas";
import { PDFGeneratorState } from "./types";
import { setupNewPage } from "./fallbackGenerator";
import { processSectionWithPageBreakCheck } from "./sectionProcessing";

/**
 * Process the left column (sidebar) of the CV
 */
export async function processLeftColumn(
  leftColumn: HTMLElement, 
  state: PDFGeneratorState, 
  theme: 'dark' | 'light'
): Promise<void> {
  console.log("Processing left column");
  
  // Create a clone of the left column to avoid modifying the original
  const leftColumnClone = leftColumn.cloneNode(true) as HTMLElement;
  document.body.appendChild(leftColumnClone);
  
  try {
    // Temporarily set the clone's style for optimal capturing
    leftColumnClone.style.position = 'absolute';
    leftColumnClone.style.left = '-9999px';
    leftColumnClone.style.top = '0';
    leftColumnClone.style.width = `${leftColumn.offsetWidth}px`;
    leftColumnClone.style.backgroundColor = state.bgColor;
    
    // Fix SVG icons display
    const svgIcons = leftColumnClone.querySelectorAll('svg');
    svgIcons.forEach(svg => {
      if (svg instanceof SVGElement) {
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = 'middle';
        svg.style.width = '16px';
        svg.style.height = '16px';
        svg.style.marginRight = '4px';
      }
    });
    
    // Fix list item display
    const listItems = leftColumnClone.querySelectorAll('li');
    listItems.forEach(item => {
      if (item instanceof HTMLElement) {
        item.style.display = 'list-item';
        item.style.marginLeft = '20px';
      }
    });
    
    // Capture the left column content
    const canvas = await html2canvas(leftColumnClone, {
      scale: 2, // Higher scale for better quality
      backgroundColor: state.bgColor,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    // Calculate dimensions
    const leftColWidth = state.contentWidth! / 3;
    const ratio = canvas.height / canvas.width;
    const leftColHeight = Math.min(leftColWidth * ratio, state.pageHeight - state.margin.top - state.margin.bottom);
    
    // Add to PDF
    state.pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      state.margin.left,
      state.margin.top,
      leftColWidth,
      leftColHeight
    );
    
    // Store left column height for reference
    state.leftColumnHeight = leftColHeight;
    console.log(`Left column processed - height: ${state.leftColumnHeight}mm`);
  } finally {
    // Clean up the clone
    if (leftColumnClone.parentNode) {
      leftColumnClone.parentNode.removeChild(leftColumnClone);
    }
  }
}

/**
 * Process the right column of the CV
 */
export async function processRightColumn(
  rightColumn: HTMLElement, 
  state: PDFGeneratorState, 
  theme: 'dark' | 'light'
): Promise<void> {
  console.log("Processing right column");
  
  // Reset y-position to top of page
  state.yPosition = state.margin.top;
  
  // 1. Process the header section (name, title, bio)
  const headerSection = rightColumn.querySelector('.cv-header-section');
  if (headerSection instanceof HTMLElement) {
    await processSectionWithPageBreakCheck(headerSection, state, theme);
  }
  
  // 2. Process experience sections
  const experienceSection = rightColumn.querySelector('.two-column-experience-section');
  if (experienceSection instanceof HTMLElement) {
    // Process the section title first
    const sectionTitle = experienceSection.querySelector('h2');
    if (sectionTitle instanceof HTMLElement) {
      await processSectionWithPageBreakCheck(sectionTitle, state, theme);
    }
    
    // Process each experience item individually to maintain integrity
    const experienceItems = experienceSection.querySelectorAll('.two-column-experience-item');
    for (let i = 0; i < experienceItems.length; i++) {
      if (experienceItems[i] instanceof HTMLElement) {
        const item = experienceItems[i] as HTMLElement;
        
        // Ensure all SVG icons display correctly
        const icons = item.querySelectorAll('svg');
        icons.forEach(icon => {
          if (icon instanceof SVGElement) {
            icon.style.display = 'inline-block';
            icon.style.verticalAlign = 'middle';
            icon.style.width = '16px';
            icon.style.height = '16px';
            icon.style.marginRight = '4px';
          }
        });
        
        // Fix bullet points for list items
        const listItems = item.querySelectorAll('li');
        listItems.forEach(li => {
          if (li instanceof HTMLElement) {
            li.style.display = 'list-item';
            li.style.marginLeft = '20px';
            li.style.position = 'relative';
          }
        });
        
        await processSectionWithPageBreakCheck(item, state, theme);
      }
    }
  }
  
  // 3. Process projects section
  const projectsSection = rightColumn.querySelector('.cv-projects-section');
  if (projectsSection instanceof HTMLElement) {
    await processSectionWithPageBreakCheck(projectsSection, state, theme);
  }
  
  // 4. Process custom sections
  const customSections = rightColumn.querySelectorAll('.custom-section');
  for (let i = 0; i < customSections.length; i++) {
    if (customSections[i] instanceof HTMLElement) {
      await processSectionWithPageBreakCheck(customSections[i] as HTMLElement, state, theme);
    }
  }
}

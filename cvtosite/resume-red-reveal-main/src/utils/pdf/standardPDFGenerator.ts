
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { PDFConfig, PDFGeneratorState } from "./types";
import { captureAndAddToPDF, prepareContentForCapture } from "./helpers";
import { setupNewPage } from "./fallbackGenerator";

/**
 * Generate a standard view PDF
 */
export const generateStandardPDF = async (
  contentArea: Element,
  config: PDFConfig
): Promise<jsPDF> => {
  const { profile, theme } = config;
  
  // Initialize PDF state
  const pdf = new jsPDF('p', 'mm', 'a4');
  const state: PDFGeneratorState = {
    pdf,
    pageWidth: pdf.internal.pageSize.getWidth(),
    pageHeight: pdf.internal.pageSize.getHeight(),
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    yPosition: 5, // Start at top margin
    pageIndex: 0,
    bgColor: theme === 'dark' ? '#0a0a0f' : '#ffffff'
  };
  
  // Initialize PDF properties
  pdf.setProperties({
    title: `${profile.name || 'CV'} Resume`,
    author: profile.name || 'CV Builder',
    keywords: 'CV, Resume, Professional',
    creator: 'CV Builder App'
  });
  
  // Prepare content for capture
  await prepareContentForCapture(contentArea);
  setupNewPage(state, theme);
  
  // Process header section
  const headerSection = contentArea.querySelector('header');
  if (headerSection) {
    const result = await captureAndAddToPDF(headerSection as HTMLElement, state, theme, 2);
    state.yPosition = result.newYPosition;
    state.pageIndex = result.newPageIndex;
  }

  // Process work experience section title
  const experienceTitle = contentArea.querySelector('.experience-section > h2');
  if (experienceTitle) {
    const result = await captureAndAddToPDF(experienceTitle as HTMLElement, state, theme);
    state.yPosition = result.newYPosition;
    state.pageIndex = result.newPageIndex;
  }

  // Process individual work experience items
  const experienceItems = contentArea.querySelectorAll('.experience-item');
  console.log(`Found ${experienceItems.length} experience items to process`);
  
  for (let i = 0; i < experienceItems.length; i++) {
    const expItem = experienceItems[i] as HTMLElement;
    
    // Make sure any "Show more" sections are expanded
    const showMoreButtons = expItem.querySelectorAll('button[aria-expanded="false"]');
    showMoreButtons.forEach(btn => {
      if (btn instanceof HTMLElement) btn.click();
    });
    
    // Wait for any animations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Add the item to the PDF
    const result = await captureAndAddToPDF(expItem, state, theme, 5); 
    state.yPosition = result.newYPosition;
    state.pageIndex = result.newPageIndex;
    
    console.log(`Added experience item ${i+1} at position ${state.yPosition}`);
  }
  
  // Process remaining sections
  const sectionSelectors = [
    '.education-skills-section',
    '.projects-section',
    '.custom-sections',
    'footer'
  ];
  
  for (const selector of sectionSelectors) {
    const section = contentArea.querySelector(selector);
    if (!section) continue;
    
    const result = await captureAndAddToPDF(section as HTMLElement, state, theme);
    state.yPosition = result.newYPosition;
    state.pageIndex = result.newPageIndex;
  }

  return pdf;
};


import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PDFConfig, PDFGeneratorState } from "./types";
import { setupNewPage } from "./fallbackGenerator";
import { processLeftColumn, processRightColumn } from "./twoColumnProcessing";
import { processSectionWithPageBreakCheck } from "./sectionProcessing";
import { ensureNoContentCutOff, createFallbackPDF } from "./fallbackGenerator";

/**
 * Generate a PDF for the Two Column CV view
 */
export const generateTwoColumnPDF = async (
  contentArea: Element,
  config: PDFConfig
): Promise<jsPDF> => {
  const { profile } = config;
  // Always use light theme for PDF generation
  const theme = 'light';
  
  // Initialize PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const state: PDFGeneratorState = {
    pdf,
    pageWidth: pdf.internal.pageSize.getWidth(),
    pageHeight: pdf.internal.pageSize.getHeight(),
    margin: {
      top: 10,
      right: 10,
      bottom: 15, // Increase bottom margin to prevent content cutoff
      left: 10
    },
    yPosition: 10, // Start at top margin
    pageIndex: 0,
    bgColor: '#ffffff' // Always use white background
  };
  
  // Calculate column dimensions
  state.contentWidth = state.pageWidth - state.margin.left - state.margin.right;
  const leftColumnWidth = state.contentWidth / 3;
  state.rightColumnX = state.margin.left + leftColumnWidth;
  state.rightColumnWidth = state.contentWidth - leftColumnWidth;
  
  // Initialize PDF properties
  pdf.setProperties({
    title: `${profile.name || 'CV'} Resume`,
    author: profile.name || 'CV Builder',
    keywords: 'CV, Resume, Professional',
    creator: 'CV Builder App'
  });
  
  try {
    console.log("Starting two-column PDF generation with light theme");
    
    // Set background for the PDF page
    setupNewPage(state, 'light');
    
    // Hide elements that shouldn't be included
    const elementsToHide = contentArea.querySelectorAll('.admin-controls, .fixed, .sticky, button[aria-label="Back to top"]');
    const hiddenStyles = new Map<HTMLElement, string>();
    
    elementsToHide.forEach(el => {
      if (el instanceof HTMLElement) {
        hiddenStyles.set(el, el.style.display);
        el.style.display = 'none';
      }
    });

    // Apply PDF-specific styles to fix alignment issues
    const pdfSpecificStyles = document.createElement('style');
    pdfSpecificStyles.textContent = `
      .pdf-capturing .badge {
        display: inline-flex !important;
        align-items: center !important;
        margin: 4px !important;
        padding: 4px 10px !important;
        white-space: nowrap !important;
      }
      .pdf-capturing svg {
        display: inline-block !important;
        vertical-align: middle !important;
        width: 16px !important;
        height: 16px !important;
        margin-right: 4px !important;
      }
      .pdf-capturing span {
        display: inline !important;
        vertical-align: middle !important;
      }
      .pdf-capturing .two-column-experience-item span.inline-flex {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .pdf-capturing ul {
        padding-left: 20px !important;
        margin-top: 8px !important;
        margin-bottom: 8px !important;
      }
      .pdf-capturing ul.list-disc li {
        margin-left: 20px !important;
        display: list-item !important;
        position: relative !important;
        padding-left: 5px !important;
      }
      .pdf-capturing ul.list-disc li::before {
        content: "•" !important;
        position: absolute !important;
        left: -15px !important;
      }
    `;
    document.head.appendChild(pdfSpecificStyles);
    contentArea.classList.add('pdf-capturing');
    
    try {
      // Process the document in two columns
      const leftColumn = contentArea.querySelector('#cv-left-column');
      const rightColumn = contentArea.querySelector('#cv-right-column');
      
      if (!leftColumn || !rightColumn) {
        throw new Error("Could not find both columns");
      }

      // Process left column first - this will be a static sidebar that repeats on each page
      await processLeftColumn(leftColumn as HTMLElement, state, 'light');
      
      // Process right column content
      await processRightColumn(rightColumn as HTMLElement, state, 'light');
      
      // Add a final page check to ensure nothing is cut off
      ensureNoContentCutOff(state);
      
      console.log(`Completed PDF generation with ${state.pageIndex + 1} pages`);
      return pdf;
    } finally {
      // Clean up temporary styles
      if (pdfSpecificStyles.parentNode) {
        pdfSpecificStyles.parentNode.removeChild(pdfSpecificStyles);
      }
      contentArea.classList.remove('pdf-capturing');
      
      // Restore hidden elements
      hiddenStyles.forEach((display, el) => {
        el.style.display = display;
      });
    }
  } catch (error) {
    console.error("Error in two-column PDF generation:", error);
    return createFallbackPDF(pdf, profile, 'light');
  }
};

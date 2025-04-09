
import { jsPDF } from "jspdf";
import { PDFGeneratorState } from "./types";

/**
 * Ensure no content is cut off at the end of the PDF
 */
export function ensureNoContentCutOff(state: PDFGeneratorState): void {
  // Check if we're close to the bottom of the page
  const remainingSpace = state.pageHeight - state.margin.bottom - state.yPosition;
  if (remainingSpace < 20) { // If less than 20mm remaining
    // Add a new page to avoid any potential cutoff
    state.pdf.addPage();
    state.pageIndex++;
    setupNewPage(state, 'light');
    
    // Add a small footer text on the last page
    state.pdf.setFontSize(8);
    state.pdf.setTextColor(150, 150, 150);
    state.pdf.text(
      "Generated with CV Builder",
      state.pageWidth / 2,
      state.pageHeight - 5,
      { align: "center" }
    );
  }
}

/**
 * Create a fallback PDF with basic information when generation fails
 */
export function createFallbackPDF(
  pdf: jsPDF, 
  profile: any, 
  theme: 'dark' | 'light'
): jsPDF {
  // Create a simple fallback PDF with error message
  const fallbackPdf = new jsPDF('p', 'mm', 'a4');
  
  // Always use light theme for fallback PDF
  fallbackPdf.setFillColor(255, 255, 255); // White background
  fallbackPdf.rect(0, 0, fallbackPdf.internal.pageSize.getWidth(), fallbackPdf.internal.pageSize.getHeight(), 'F');
  fallbackPdf.setTextColor(220, 38, 38); // Red text for error
  
  // Add the profile name if available
  if (profile.name) {
    fallbackPdf.setFontSize(24);
    fallbackPdf.text(profile.name, 20, 30);
    
    if (profile.title) {
      fallbackPdf.setFontSize(16);
      fallbackPdf.text(profile.title, 20, 40);
    }
    
    fallbackPdf.line(20, 45, 190, 45);
  }
  
  // Add error message with better formatting
  fallbackPdf.setFontSize(16);
  fallbackPdf.text("Error generating PDF. Please try the standard view instead.", 20, 60);
  
  fallbackPdf.setFontSize(12);
  fallbackPdf.text("The CV View layout couldn't be properly captured. Switch to Standard View for better results.", 20, 70);
  
  // Add contact info if available
  if (profile.contact) {
    fallbackPdf.setFontSize(12);
    fallbackPdf.text("Contact Information:", 20, 100);
    
    let yPos = 110;
    
    if (profile.contact.email) {
      fallbackPdf.setFontSize(10);
      fallbackPdf.text(`Email: ${profile.contact.email}`, 20, yPos);
      yPos += 7;
    }
    
    if (profile.contact.phone) {
      fallbackPdf.setFontSize(10);
      fallbackPdf.text(`Phone: ${profile.contact.phone}`, 20, yPos);
      yPos += 7;
    }
    
    if (profile.contact.location) {
      fallbackPdf.setFontSize(10);
      fallbackPdf.text(`Location: ${profile.contact.location}`, 20, yPos);
    }
  }
  
  return fallbackPdf;
}

/**
 * Setup a new page in the PDF with the correct background
 */
export function setupNewPage(state: PDFGeneratorState, theme: 'dark' | 'light'): void {
  if (theme === 'dark') {
    state.pdf.setFillColor(10, 10, 15);
    state.pdf.rect(0, 0, state.pageWidth, state.pageHeight, 'F');
  }
}

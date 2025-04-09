
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { WebsiteData } from "@/types/website";
import { PDFConfig } from "./types";
import { generateStandardPDF } from "./standardPDFGenerator";
import { generateTwoColumnPDF } from "./twoColumnPDFGenerator";

/**
 * Main PDF Generator class that coordinates the PDF creation process
 */
export class PDFGenerator {
  private config: PDFConfig;
  private pdf: jsPDF | null = null;

  constructor(profile: WebsiteData, theme: 'dark' | 'light', view: "standard" | "two-column" = "standard") {
    // Use the provided theme (don't force light theme anymore)
    this.config = {
      profile,
      theme, // Use the theme parameter
      view
    };
  }

  /**
   * Main method to generate PDF from CV content
   */
  public async generatePDF(): Promise<Blob> {
    try {
      toast.info("Preparing CV PDF. This may take a moment...");
      console.log(`Starting PDF generation in ${this.config.view} view with ${this.config.theme} theme`);

      // Get the content area based on the view
      const contentArea = document.querySelector('.pdf-printable-area');
      
      if (!contentArea) {
        throw new Error("Could not find content to print");
      }

      // Generate the PDF based on the view type
      try {
        console.log("Generating PDF with selected view:", this.config.view);
        
        if (this.config.view === "two-column") {
          // Always use light theme for two-column view for better readability
          const twoColumnConfig = { ...this.config, theme: 'light' as const };
          this.pdf = await generateTwoColumnPDF(contentArea, twoColumnConfig);
          console.log("Two-column PDF generation complete");
        } else {
          // Use the selected theme for standard view
          this.pdf = await generateStandardPDF(contentArea, this.config);
          console.log("Standard PDF generation complete");
        }
      } catch (genError) {
        console.error("Error in specific PDF generator:", genError);
        
        // Create a fallback PDF with error message
        this.pdf = new jsPDF('p', 'mm', 'a4');
        const { profile, theme } = this.config;
        
        // Set background color
        if (theme === 'dark') {
          this.pdf.setFillColor(30, 30, 35); // Dark background
          this.pdf.rect(0, 0, this.pdf.internal.pageSize.getWidth(), this.pdf.internal.pageSize.getHeight(), 'F');
          this.pdf.setTextColor(255, 255, 255); // White text
        } else {
          this.pdf.setFillColor(255, 255, 255); // White background
          this.pdf.rect(0, 0, this.pdf.internal.pageSize.getWidth(), this.pdf.internal.pageSize.getHeight(), 'F');
          this.pdf.setTextColor(0, 0, 0); // Black text
        }
        
        // Add the name and title
        this.pdf.setFontSize(28);
        this.pdf.setTextColor(theme === 'dark' ? 255 : 200, 77, 97); // Red color
        this.pdf.text(profile.name || 'Your Name', 20, 30);
        
        this.pdf.setFontSize(18);
        this.pdf.text(profile.title || 'Your Professional Title', 20, 45);
        
        // Add horizontal line
        if (theme === 'dark') {
          this.pdf.setDrawColor(100, 100, 120);
        } else {
          this.pdf.setDrawColor(200, 200, 200);
        }
        this.pdf.line(20, 55, this.pdf.internal.pageSize.getWidth() - 20, 55);
        
        // Add error message
        this.pdf.setFontSize(22);
        this.pdf.setTextColor(theme === 'dark' ? 255 : 200, 77, 97); // Red color
        this.pdf.text("Error generating PDF. Please try the standard view instead.", 20, 80);
        
        this.pdf.setFontSize(16);
        if (theme === 'dark') {
          this.pdf.setTextColor(200, 200, 220);
        } else {
          this.pdf.setTextColor(100, 100, 100);
        }
        this.pdf.text("The CV View layout couldn't be properly captured.", 20, 95);
        this.pdf.text("Switch to Standard View for better results.", 20, 110);
        
        // Add contact information if available
        if (profile.contact) {
          this.pdf.setFontSize(18);
          this.pdf.setTextColor(theme === 'dark' ? 255 : 200, 77, 97); // Red color
          this.pdf.text("Contact Information:", 20, 140);
          
          this.pdf.setFontSize(14);
          if (theme === 'dark') {
            this.pdf.setTextColor(200, 200, 220);
          } else {
            this.pdf.setTextColor(100, 100, 100);
          }
          
          let yPos = 155;
          if (profile.contact.email) {
            this.pdf.text(`Email: ${profile.contact.email}`, 20, yPos);
            yPos += 15;
          }
          if (profile.contact.phone) {
            this.pdf.text(`Phone: ${profile.contact.phone}`, 20, yPos);
            yPos += 15;
          }
          if (profile.contact.location) {
            this.pdf.text(`Location: ${profile.contact.location}`, 20, yPos);
          }
        }
      }

      // Generate PDF as blob
      if (!this.pdf) {
        throw new Error("PDF generation failed");
      }
      
      console.log("Converting PDF to blob");
      const pdfBlob = this.pdf.output('blob');
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again or switch to Standard View.");
      throw error;
    }
  }

  /**
   * Save the generated PDF with a filename
   */
  public savePDF(): void {
    if (!this.pdf) {
      toast.error("No PDF has been generated yet");
      return;
    }
    
    const filename = `${this.config.profile.name || 'CV'}-resume.pdf`;
    try {
      console.log("Saving PDF as:", filename);
      this.pdf.save(filename);
      toast.success("PDF successfully generated!");
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Failed to save PDF. Please try again.");
    }
  }
}

/**
 * Generate and download a PDF from the CV content
 */
export const generateAndDownloadPDF = async (
  profile: WebsiteData, 
  theme: 'dark' | 'light',
  view: "standard" | "two-column" = "standard"
): Promise<void> => {
  try {
    console.log(`Initiating PDF download process for ${view} view with ${theme} theme`);
    // Use the provided theme - don't force light anymore
    const generator = new PDFGenerator(profile, theme, view);
    await generator.generatePDF();
    generator.savePDF();
  } catch (error) {
    console.error("PDF generation failed:", error);
    // Error is already handled in the generator
  }
};

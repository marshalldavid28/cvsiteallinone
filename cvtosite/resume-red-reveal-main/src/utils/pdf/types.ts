
import { WebsiteData } from "@/types/website";
import { jsPDF } from "jspdf";

/**
 * Configuration for PDF generation
 */
export interface PDFConfig {
  profile: WebsiteData;
  theme: 'dark' | 'light';
  view: "standard" | "two-column";
}

/**
 * Result of capturing an element for the PDF
 */
export interface CaptureResult {
  newYPosition: number;
  newPageIndex: number;
}

/**
 * Base PDF generator state
 */
export interface PDFGeneratorState {
  pdf: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: { 
    top: number; 
    right: number; 
    bottom: number; 
    left: number 
  };
  yPosition: number;
  pageIndex: number;
  bgColor: string;
  leftColumnHeight?: number; // For two-column layout
  contentWidth?: number; // Width available for content
  rightColumnX?: number; // Starting X position for right column
  rightColumnWidth?: number; // Width of right column
}

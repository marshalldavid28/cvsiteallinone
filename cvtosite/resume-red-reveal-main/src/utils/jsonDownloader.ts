
/**
 * Utility for downloading CV data as a JSON file
 */
import { WebsiteData } from "@/types/website";
import { getDesignStyles } from "@/components/preview/StyleUtils";
import { getAppleInspiredColors } from "@/components/preview/cv/CVColorScheme";

/**
 * Generates and triggers download of the CV data as a JSON file
 */
export const downloadCVasJSON = (profile: WebsiteData, filename?: string): void => {
  try {
    // Clone the profile to avoid reference issues
    const profileData = JSON.parse(JSON.stringify(profile));
    
    // Get styling information based on the profile's design style
    const designStyles = getDesignStyles(profile, "light");
    const cvColors = getAppleInspiredColors();
    
    // Enhanced metadata for converter support
    const enhancedCVData = {
      metadata: {
        version: "1.0", // Version of CV JSON format
        generatedAt: new Date().toISOString(),
        converterHints: {
          recommendedLayout: profile.designStyle || "standard", // Use the user's selected design style
          preferredSections: [
            "header",
            "profile",
            "experience",
            "education",
            "skills",
            "projects"
          ],
          fontRecommendations: {
            headingFont: profile.fontPairings?.heading || "sans-serif",
            bodyFont: profile.fontPairings?.body || "serif"
          }
        }
      },
      styling: {
        // Provide styling guidance for converters
        colors: {
          primary: "#FF4D61", // Brand red color
          secondary: "#121418", // Brand dark color
          text: "#333333",
          background: "#FFFFFF",
          accent: "#0EA5E9", // Bright blue for accents
          muted: "#F3F4F6"
        },
        fonts: {
          heading: profile.fontPairings?.heading || "sans-serif",
          body: profile.fontPairings?.body || "serif"
        },
        spacing: {
          sectionMargin: "1.5rem",
          paragraphMargin: "1rem",
          itemSpacing: "0.75rem"
        },
        layout: {
          pageSize: "A4",
          margins: "1in",
          columns: profile.designStyle === "tech" ? 2 : 1
        },
        elements: {
          // Element styling guidance
          header: {
            background: cvColors.leftCol,
            textColor: cvColors.headerText
          },
          section: {
            titleColor: cvColors.sectionHeader,
            titleSize: "16px",
            titleWeight: "600",
            titleCase: "uppercase"
          },
          skills: {
            display: "inline-block",
            background: cvColors.badge,
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem"
          },
          timeline: {
            lineColor: cvColors.separator,
            itemPadding: "0.5rem 0"
          }
        }
      },
      profile: profileData
    };
    
    // Format JSON with indentation for better readability in converters
    const jsonString = JSON.stringify(enhancedCVData, null, 2);
    
    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `${profile.name.replace(/\s+/g, '-')}-cv.json`;
    
    // Append, click, and remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading CV as JSON:", error);
    throw error;
  }
};


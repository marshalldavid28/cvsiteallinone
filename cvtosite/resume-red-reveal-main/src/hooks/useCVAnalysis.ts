
import { WebsiteData } from "@/types/website";
import { supabase } from "@/integrations/supabase/client";

// Fallback profile to use if parsing fails
const mockProfile: WebsiteData = {
  name: "Alex Johnson",
  title: "Senior Software Engineer",
  bio: "Passionate software engineer with 8+ years of experience",
  headline: "Turning Complex Problems into Elegant Solutions",
  experience: [],
  education: [],
  skills: []
};

export async function analyzeCV(cvText: string, designStyle: string, linkedInUrl: string | null) {
  try {
    // Get the current session for authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      console.error("No active session or access token available");
      throw new Error("You must be logged in to analyze a CV");
    }

    // Fixed URL with the correct domain and properly formatted path
    const analyzeResponse = await fetch("https://pbpipqltnkhnchhjmkrr.supabase.co/functions/v1/analyze-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        cvText,
        designStyle,
        linkedInUrl: linkedInUrl || null,
      }),
    });
    
    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `Error ${analyzeResponse.status}: ${analyzeResponse.statusText}`;
      console.error("CV analysis failed:", errorMessage, errorData);
      throw new Error(`Failed to analyze CV: ${errorMessage}`);
    }
    
    const analyzeData = await analyzeResponse.json();
    console.log("CV Analysis result:", analyzeData);
    
    if (analyzeData.error) {
      throw new Error(analyzeData.error);
    }

    return analyzeData;
  } catch (error) {
    console.error("Error in analyzeCV:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

export function parseWebsiteData(analyzeData: any): WebsiteData {
  let websiteData;
  
  // Try to parse the website data
  if (analyzeData.websiteContent) {
    websiteData = analyzeData.websiteContent;
    
    // Store optimization notes if they exist
    if (websiteData.optimizationNotes) {
      localStorage.setItem('cvOptimizationNotes', websiteData.optimizationNotes);
    }
  } else if (analyzeData.rawContent) {
    // Try to extract a JSON object from the raw content if it exists
    try {
      // Look for JSON-like structure in the raw content
      const jsonMatch = analyzeData.rawContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analyzeData.rawContent;
      
      try {
        websiteData = JSON.parse(jsonString);
      } catch (e) {
        // If JSON parsing fails, store the raw content
        console.error("JSON parsing failed:", e);
        localStorage.setItem("rawWebsiteData", analyzeData.rawContent);
        websiteData = mockProfile; // Use fallback data
      }
    } catch (e) {
      console.error("Raw content extraction failed:", e);
      localStorage.setItem("rawWebsiteData", analyzeData.rawContent);
      websiteData = mockProfile; // Use fallback data
    }
  }
  
  if (!websiteData) {
    console.error("No website data available after analysis");
    throw new Error("Failed to extract data from your CV. Please try a different file format or contact support.");
  }

  // Ensure websiteData has required fields
  if (!websiteData.experience) websiteData.experience = [];
  if (!websiteData.education) websiteData.education = [];
  
  return websiteData;
}

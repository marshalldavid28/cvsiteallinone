
import { WebsiteData } from "@/types/website";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export async function saveWebsiteData(websiteData: WebsiteData, userId: string) {
  // Store the website data in localStorage
  localStorage.setItem("websiteData", JSON.stringify(websiteData));
  
  // Store in Supabase with the authenticated user's ID
  try {
    console.log("Storing CV in Supabase with user_id:", userId);
    console.log("Website data to store:", JSON.stringify(websiteData).substring(0, 200) + "...");
    
    // Ensure the displayPicture field is included in the data
    if (websiteData.displayPicture) {
      console.log("Profile image URL included:", websiteData.displayPicture);
    } else {
      console.log("No profile image URL in website data");
    }
    
    // Cast the websiteData to Json type to satisfy Supabase type requirements
    const { data, error } = await supabase
      .from('cv_websites')
      .insert({ 
        user_id: userId,
        website_data: websiteData as unknown as Json
      })
      .select('id')
      .single();
    
    if (error) {
      console.error("Failed to store CV in Supabase:", error);
      toast.error("Failed to save your CV website data");
      return null; // Return null to indicate Supabase storage failed
    } else if (data && data.id) {
      console.log("Successfully stored CV with ID:", data.id);
      toast.success("Your CV website has been created successfully!");
      return data.id; // Return the database ID for navigation
    }
  } catch (e) {
    console.error("Failed to store CV in Supabase:", e);
    toast.error("Error saving your CV website");
    return null;
  }
  
  return userId; // Fallback to using userId if Supabase storage failed
}

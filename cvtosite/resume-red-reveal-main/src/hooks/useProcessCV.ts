
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProcessingState } from "@/hooks/useProcessingState";
import { analyzeCV, parseWebsiteData } from "@/hooks/useCVAnalysis";
import { uploadProfileImage } from "@/hooks/useProfileImageUpload";
import { saveWebsiteData } from "@/services/websiteDataService";
import { WebsiteData } from "@/types/website";

interface UseProcessCVProps {
  file: File | null;
  cvText: string;
  designStyle: string;
  linkedInUrl: string;
  profileImage: File | null;
}

export function useProcessCV({ file, cvText, designStyle, linkedInUrl, profileImage }: UseProcessCVProps) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { 
    processingState, 
    updateProcessingState, 
    handleReset, 
    totalSteps 
  } = useProcessingState();
  
  const processCV = async () => {
    if (!file) {
      toast.error("Please upload a CV first");
      return;
    }
    
    if (!cvText || cvText.trim().length < 50) {
      toast.error("Failed to extract enough text from CV. Please try a different file.");
      return;
    }
    
    updateProcessingState({
      isProcessing: true,
      processingError: null
    });
    
    try {
      // Step 1: Upload
      updateProcessingState({ 
        processingStep: 1,
        currentStepText: "Uploading CV..." 
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Analysis
      updateProcessingState({ 
        processingStep: 2,
        currentStepText: "Analyzing content..." 
      });
      
      const analyzeData = await analyzeCV(cvText, designStyle, linkedInUrl.trim());
      
      // Step 3: Extracting data
      updateProcessingState({ 
        processingStep: 3,
        currentStepText: "Extracting professional data..." 
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 4: Design
      updateProcessingState({ 
        processingStep: 4,
        currentStepText: "Designing your website..." 
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 5: Publishing
      updateProcessingState({ 
        processingStep: 5,
        currentStepText: "Publishing your website..." 
      });
      
      // Parse website data from analysis result
      let websiteData = parseWebsiteData(analyzeData);
      
      // Use the actual authenticated user ID instead of generating a random one
      const actualUserId = userId || `user_${Math.random().toString(36).substr(2, 9)}`;
      console.log("Using user ID for CV website:", actualUserId);
      
      // Handle profile image upload if provided
      if (profileImage) {
        updateProcessingState({ 
          currentStepText: "Uploading profile image..." 
        });
        
        console.log("Starting profile image upload process");
        console.log("Profile image to upload:", profileImage.name, "Size:", profileImage.size, "Type:", profileImage.type);
        
        try {
          const imageUrl = await uploadProfileImage(profileImage, actualUserId);
          
          if (imageUrl) {
            // Add the image URL to the website data
            websiteData = {
              ...websiteData,
              displayPicture: imageUrl
            };
            console.log("Added profile image URL to website data:", imageUrl);
            toast.success("Profile image uploaded successfully");
          } else {
            console.warn("Profile image upload failed, continuing without profile image");
            // Continue without the profile image rather than showing an error
          }
        } catch (uploadError) {
          console.error("Error during profile image upload:", uploadError);
          // Continue without the profile image rather than stopping the whole process
          toast.warning("Could not upload profile image, but continuing with website creation");
        }
      } else {
        console.log("No profile image provided, skipping upload");
      }
      
      // Add ID to website data
      websiteData.id = actualUserId;
      
      // Save website data to Supabase and localStorage
      const savedId = await saveWebsiteData(websiteData, actualUserId);
      
      // Navigate to preview page
      if (savedId) {
        navigate(`/preview/${savedId}`);
      } else {
        // Fallback navigation if Supabase storage failed
        navigate(`/preview/${actualUserId}`);
      }
      
    } catch (error) {
      console.error("Processing error:", error);
      const errorMessage = error instanceof Error ? error.message : "There was an error processing your CV";
      updateProcessingState({
        processingError: errorMessage,
        isProcessing: false
      });
      toast.error(errorMessage);
    }
  };
  
  return {
    processCV,
    handleReset,
    processingState,
    totalSteps
  };
}

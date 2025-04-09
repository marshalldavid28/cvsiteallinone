
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, SparklesIcon } from "lucide-react";
import { WebsiteData } from "@/types/website";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SkillsExtractorProps {
  profile: WebsiteData;
  onProfileUpdate: (updatedProfile: WebsiteData) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const SkillsExtractor: React.FC<SkillsExtractorProps> = ({
  profile,
  onProfileUpdate,
  isLoading,
  setIsLoading
}) => {
  const handleExtractSkills = async () => {
    setIsLoading(true);
    
    try {
      // Crafting a prompt specifically to extract skills from experience, certifications, etc.
      const extractSkillsPrompt = "Extract all professional skills from my experience, projects, certifications, and education. Create a comprehensive skills section that accurately reflects my expertise based on my CV content.";
      
      console.log("Sending skills extraction prompt to edge function");
      console.log("Profile keys being sent:", Object.keys(profile));
      
      const { data, error } = await supabase.functions.invoke('edit-cv', {
        body: {
          prompt: extractSkillsPrompt,
          currentProfile: profile
        }
      });
      
      if (error) {
        console.error("Supabase functions error:", error);
        throw new Error(`Error calling AI service: ${error.message}`);
      }
      
      console.log("Response from edge function:", data);
      
      if (data.error) {
        console.error("Edge function reported error:", data.error, data.details || '');
        throw new Error(data.error);
      }
      
      if (data.success && data.updatedProfile) {
        // Apply the changes to the profile
        onProfileUpdate(data.updatedProfile);
        
        // Show success message
        toast.success("Skills extracted successfully!");
      } else {
        console.error("Invalid response structure from AI service:", data);
        throw new Error("Invalid response from AI service");
      }
    } catch (err) {
      console.error("Error extracting skills:", err);
      toast.error(err instanceof Error ? err.message : "Failed to extract skills. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile.skills || profile.skills.length === 0) {
    return (
      <div className="mb-4">
        <Button
          className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
          onClick={handleExtractSkills}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SparklesIcon className="h-4 w-4" />}
          Extract Skills from my CV
        </Button>
        <p className="text-xs text-center mt-2 text-gray-400">
          No skills section detected. Generate one based on your experience.
        </p>
      </div>
    );
  }
  
  return null;
};

export default SkillsExtractor;

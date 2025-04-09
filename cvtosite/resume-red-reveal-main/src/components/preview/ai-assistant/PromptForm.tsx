
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendIcon } from "lucide-react";
import { WebsiteData } from "@/types/website";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  profile: WebsiteData;
  onProfileUpdate: (updatedProfile: WebsiteData) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess?: () => void;
  theme: 'dark' | 'light';
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  profile,
  onProfileUpdate,
  isLoading,
  setIsLoading,
  onSuccess,
  theme
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Sending prompt to edge function:", prompt.trim());
      console.log("Profile keys being sent:", Object.keys(profile));
      
      const { data, error } = await supabase.functions.invoke('edit-cv', {
        body: {
          prompt: prompt.trim(),
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
        toast.success("CV updated successfully!");
        
        // Clear the prompt
        setPrompt('');
        
        // Notify parent component of success
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Invalid response structure from AI service:", data);
        throw new Error("Invalid response from AI service");
      }
    } catch (err) {
      console.error("Error updating CV:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update CV. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI to update your CV (e.g., 'Make my job descriptions more concise', 'Highlight my leadership skills', etc.)"
        className={`min-h-[100px] mb-4 ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        }`}
        disabled={isLoading}
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-brand-red hover:bg-brand-red/90 text-white"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4 mr-2" />
              Update CV
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-500">
        The AI will update your CV based on your instructions. 
        Be specific about what you want to change.
      </div>
    </form>
  );
};

export default PromptForm;

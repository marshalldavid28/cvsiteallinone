
import { useState, useCallback, useEffect } from "react";
import { WebsiteData } from "@/types/website";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useShareUrl = (profile: WebsiteData, publicShareUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [existingRecord, setExistingRecord] = useState<{ id: string, custom_slug: string | null } | null>(null);
  
  // Load existing URL data when the component mounts
  useEffect(() => {
    const checkExistingUrl = async () => {
      if (!profile || !profile.id) return;
      
      try {
        console.log("Checking for existing URL for user ID:", profile.id);
        
        const { data, error } = await supabase
          .from('cv_websites')
          .select('id, custom_slug')
          .eq('user_id', profile.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          console.log("Found existing URL record:", data);
          setExistingRecord(data);
          
          const currentDomain = window.location.origin;
          const url = data.custom_slug 
            ? `${currentDomain}/${data.custom_slug}` 
            : `${currentDomain}/${data.id}`;
          
          setShareUrl(url);
          
          if (data.custom_slug) {
            setCustomSlug(data.custom_slug);
          }
        }
      } catch (err) {
        console.error("Error checking for existing URL:", err);
      }
    };
    
    checkExistingUrl();
  }, [profile]);
  
  // Function to check if a slug is available
  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.trim() === "") return false;
    
    // Basic validation: only allow letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setSlugError("Slug can only contain lowercase letters, numbers, and hyphens");
      return false;
    }
    
    try {
      // Check if slug is already taken
      const { data, error } = await supabase
        .from('cv_websites')
        .select('id')
        .eq('custom_slug', slug)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking slug availability:', error);
        setSlugError("Error checking slug availability");
        return false;
      }
      
      // If data exists and it's not our own record, the slug is taken
      if (data && (!existingRecord || data.id !== existingRecord.id)) {
        setSlugError("This URL is already taken. Please try another one.");
        return false;
      }
      
      setSlugError(null);
      return true;
    } catch (err) {
      console.error('Exception checking slug:', err);
      setSlugError("Error checking slug availability");
      return false;
    }
  }, [existingRecord]);
  
  // Function to store CV data and get a shareable URL
  const generateShareableUrl = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Ensure we have a valid user ID
      const userId = profile.id || `user_${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if the custom slug is available (if provided)
      let slugToUse = null;
      if (customSlug && customSlug.trim() !== "") {
        const isAvailable = await checkSlugAvailability(customSlug);
        if (!isAvailable) {
          setIsLoading(false);
          return; // Stop the process if slug is not available
        }
        slugToUse = customSlug.trim();
      }
      
      // Safely convert profile to Json type for Supabase
      const safeProfile = JSON.parse(JSON.stringify(profile));
      
      // Get the current domain to use for the URL - this works on ALL domains
      const currentDomain = window.location.origin;
      
      console.log("Attempting to store CV data with user_id:", userId);
      console.log("Using domain for URL:", currentDomain);
      console.log("Custom slug:", slugToUse);
      console.log("Existing record:", existingRecord);
      
      // Store the profile data in Supabase - use upsert to update if exists
      const { data, error } = await supabase
        .from('cv_websites')
        .upsert({ 
          user_id: userId,
          website_data: safeProfile,
          updated_at: new Date().toISOString(),
          custom_slug: slugToUse,
          // If we have an existing record ID, include it for the upsert
          ...(existingRecord && { id: existingRecord.id })
        })
        .select('id, custom_slug')
        .single();
      
      if (error) {
        console.error('Error storing CV website data:', error);
        throw error;
      }
      
      // TypeScript safety: ensure we have the expected data structure
      if (!data) {
        console.error('No valid data returned from upsert operation');
        throw new Error('Failed to create shareable URL');
      }
      
      console.log('Successfully stored CV data, received:', data);
      
      // Update our existing record reference
      setExistingRecord(data);
      
      // Generate the URL based on whether a custom slug is available
      let directUrl;
      if (data.custom_slug) {
        directUrl = `${currentDomain}/${data.custom_slug}`;
      } else {
        directUrl = `${currentDomain}/${data.id}`;
      }
      
      setShareUrl(directUrl);
      toast.success(existingRecord ? "CV website updated successfully!" : "CV website published successfully!");
      
    } catch (error) {
      console.error('Error generating shareable URL:', error);
      toast.error("Could not create shareable URL. Please try again.");
      setShareUrl("");
    } finally {
      setIsLoading(false);
    }
  }, [profile, customSlug, checkSlugAvailability, existingRecord]);

  const handleCopyLink = useCallback(() => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success("Public URL copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  return {
    isLoading,
    shareUrl,
    copied,
    generateShareableUrl,
    handleCopyLink,
    customSlug,
    setCustomSlug,
    slugError,
    checkSlugAvailability,
    existingRecord
  };
};

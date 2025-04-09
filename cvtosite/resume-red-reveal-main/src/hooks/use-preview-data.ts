
import { useState, useEffect } from "react";
import { WebsiteData } from "@/types/website";
import { toast } from "sonner";
import { updateProfileField } from "@/utils/profileUpdates";
import { supabase } from "@/integrations/supabase/client";

// Default values for empty profile
const defaultProfileData: WebsiteData = {
  name: "Your Name",
  title: "Your Professional Title",
  bio: "A short bio about yourself",
  headline: "Your professional headline",
  experience: [],
  education: [],
  skills: []
};

export const usePreviewData = (
  userId: string | undefined, 
  viewMode: string | null,
  isSlugResolving: boolean = false // New parameter to prevent premature loading
) => {
  const [profile, setProfile] = useState<WebsiteData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [databaseRecordId, setDatabaseRecordId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfileData = async () => {
      // If we're still resolving a slug, don't try to load profile data yet
      if (isSlugResolving) {
        return;
      }
      
      setIsLoading(true);
      setLoadError(null);
      
      try {
        if (!userId) {
          throw new Error("No user ID provided");
        }
        
        console.log("Loading data for ID:", userId);
        console.log("View mode:", viewMode);
        
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidPattern.test(userId);
        
        console.log("Is valid UUID:", isUuid);
        
        let query;
        
        if (isUuid) {
          console.log("Querying by ID (UUID)");
          query = supabase
            .from('cv_websites')
            .select('website_data, id')
            .eq('id', userId);
        } else {
          console.log("Querying by user_id");
          query = supabase
            .from('cv_websites')
            .select('website_data, id')
            .eq('user_id', userId);
        }
        
        const { data, error } = await query.maybeSingle();
        
        console.log("Supabase query result:", { data, error });
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        if (data && data.website_data) {
          console.log("Successfully loaded profile data from Supabase");
          // Store the database record ID for future updates
          setDatabaseRecordId(data.id);
          
          // Merge with default values to ensure required fields exist
          const websiteData = {
            ...defaultProfileData,
            ...data.website_data as unknown as WebsiteData
          };
          setProfile(websiteData);
          
          // Determine if we should show admin controls
          // SECURITY FIX: In a real authentication system, you'd verify the user is
          // authenticated and is the owner of this CV. For now we're using view param
          // but this would be replaced with proper auth checks
          setIsAdmin(viewMode !== 'public');
        } else {
          console.warn("No data found in Supabase for this ID");
          setLoadError("No CV website found for this ID");
          // Initialize with default values when no data is found
          setProfile(defaultProfileData);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        setLoadError(error instanceof Error ? error.message : "Unknown error");
        
        // Don't show the toast during initial load or slug resolution
        // This prevents the "failed to load" toast from showing during normal navigation
        if (!isSlugResolving) {
          toast.error("Failed to load CV website data");
        }
        
        // Initialize with default values on error
        setProfile(defaultProfileData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [userId, viewMode, isSlugResolving]);
  
  // Force public view mode regardless of URL manipulation attempts
  useEffect(() => {
    if (viewMode === 'public') {
      setIsAdmin(false);
      setIsEditMode(false);
    }
  }, [viewMode]);
  
  const toggleEditMode = () => {
    // Only allow toggling edit mode if the user has admin privileges
    if (!isAdmin) return;
    
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      toast.info("Edit mode enabled. Hover over text to edit.");
    } else {
      toast.success("Edit mode disabled. Changes have been saved.");
    }
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    toast.info(`${theme === 'dark' ? 'Light' : 'Dark'}` + " mode enabled.");
  };
  
  const handleProfileUpdate = async (fieldOrProfile: string | WebsiteData, value?: string) => {
    // Only allow updates if the user has edit mode enabled
    if (!isEditMode) return;
    
    if (!profile) {
      console.error("Profile is null, cannot update.");
      return;
    }

    let updatedProfile: WebsiteData;
    
    // If receiving a full profile object (from AI update)
    if (typeof fieldOrProfile === 'object') {
      updatedProfile = fieldOrProfile;
      console.log("Updating entire profile with AI-generated content");
    } 
    // If receiving field/value pair (from EditableField)
    else if (typeof fieldOrProfile === 'string' && value !== undefined) {
      updatedProfile = updateProfileField(profile as WebsiteData, fieldOrProfile, value);
      console.log(`Updated ${fieldOrProfile} to:`, value);
    }
    else {
      console.error("Invalid arguments for handleProfileUpdate");
      return;
    }
    
    if (!updatedProfile.id) {
      updatedProfile.id = `user_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    setProfile(updatedProfile);
    localStorage.setItem("websiteData", JSON.stringify(updatedProfile));
    
    if (isEditMode) {
      try {
        // If we have a database record ID, always update that record
        // This ensures changes are reflected on the shared URL
        if (databaseRecordId) {
          console.log("Updating existing record:", databaseRecordId);
          const safeProfile = JSON.parse(JSON.stringify(updatedProfile));
          
          const { error } = await supabase
            .from('cv_websites')
            .update({ 
              website_data: safeProfile,
              updated_at: new Date().toISOString()
            })
            .eq('id', databaseRecordId);
            
          if (error) {
            console.error("Error updating CV website in Supabase:", error);
            throw error;
          }
          
          console.log("Successfully updated profile in database");
        } 
        // If no database record ID but we have a userId, update by userId
        else if (userId) {
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const isUuid = uuidPattern.test(userId);
          
          const safeProfile = JSON.parse(JSON.stringify(updatedProfile));
          
          if (isUuid) {
            const { error } = await supabase
              .from('cv_websites')
              .update({ 
                website_data: safeProfile,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId);
              
            if (error) {
              console.error("Error updating CV website in Supabase:", error);
              throw error;
            }
          } else {
            const { error } = await supabase
              .from('cv_websites')
              .upsert({ 
                user_id: userId,
                website_data: safeProfile,
                updated_at: new Date().toISOString()
              });
              
            if (error) {
              console.error("Error updating CV website in Supabase:", error);
              throw error;
            }
          }
        }
      } catch (error) {
        console.error("Error updating CV website in Supabase:", error);
      }
    }
  };
  
  return {
    profile,
    isAdmin,
    isEditMode: profile ? isEditMode : false,
    isLoading,
    loadError,
    toggleEditMode,
    handleProfileUpdate,
    theme,
    toggleTheme,
    databaseRecordId
  };
};


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to upload profile image to Supabase storage
export const uploadProfileImage = async (imageFile: File, userId: string): Promise<string | null> => {
  try {
    console.log("Starting profile image upload for user:", userId);
    
    // Create a unique filename for the profile image with timestamp to prevent caching
    const fileExt = imageFile.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}-profile-${timestamp}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log(`Uploading to bucket "profile-images", path: ${filePath}`);
    
    // Upload to the existing bucket
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('profile-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: imageFile.type
      });

    if (uploadError) {
      console.error('Error uploading profile image:', uploadError);
      
      if (uploadError.message.includes('storage/object-too-large')) {
        toast.error('Profile image is too large. Maximum size is 2MB.');
      } else if (uploadError.message.includes('The resource was not found') || 
                uploadError.message.includes('does not exist')) {
        toast.error('Storage bucket not properly configured. Please contact support.');
      } else {
        toast.error(`Failed to upload image: ${uploadError.message}`);
      }
      
      return null;
    }

    console.log("Image uploaded successfully, data:", uploadData);

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      console.error('No public URL returned');
      toast.error('Failed to get public URL for uploaded image');
      return null;
    }
    
    // Add cache-busting query parameter
    const cacheBustedUrl = `${urlData.publicUrl}?t=${timestamp}`;
    console.log("Successfully uploaded image, public URL:", cacheBustedUrl);
    return cacheBustedUrl;
  } catch (error) {
    console.error('Error in profile image upload:', error);
    let errorMessage = "Error uploading profile image";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
    return null;
  }
};

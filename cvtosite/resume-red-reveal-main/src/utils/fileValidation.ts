
import { toast } from "sonner";

export const validateFile = (file: File): boolean => {
  // Check file type
  const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
  if (!validTypes.includes(file.type)) {
    toast.error("Please upload a PDF, Word document, or text file");
    return false;
  }
  
  // Check file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    toast.error("File size should be less than 10MB");
    return false;
  }
  
  // Check if file is empty
  if (file.size === 0) {
    toast.error("The file appears to be empty");
    return false;
  }
  
  return true;
};

export const validateProfileImage = (file: File): boolean => {
  // Check if it's an image file
  const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"];
  if (!validImageTypes.includes(file.type)) {
    toast.error("Please upload a valid image file (JPEG, PNG, GIF or WebP)");
    return false;
  }
  
  // Check file size (2MB max for images)
  if (file.size > 2 * 1024 * 1024) {
    toast.error("Image size should be less than 2MB");
    return false;
  }
  
  return true;
};

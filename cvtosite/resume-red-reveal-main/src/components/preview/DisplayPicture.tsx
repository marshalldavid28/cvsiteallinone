
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import EditableField from "./EditableField";

interface DisplayPictureProps {
  imageUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  isAdmin?: boolean;
  onUpdate?: (value: string) => void;
  borderColor?: string;
}

const DisplayPicture: React.FC<DisplayPictureProps> = ({
  imageUrl,
  name,
  size = "lg",
  isAdmin = false,
  onUpdate,
  borderColor = "border-white/20"
}) => {
  const [imageError, setImageError] = useState(false);
  const [uniqueImageUrl, setUniqueImageUrl] = useState<string | undefined>(imageUrl);
  
  // Reset image error state and update unique URL when imageUrl changes
  useEffect(() => {
    setImageError(false);
    if (imageUrl) {
      try {
        // Make sure we're using the most up-to-date URL by forcing cache refresh
        // If imageUrl already has a query parameter, preserve it and add our timestamp
        const hasQueryParams = imageUrl.includes('?');
        const cacheBuster = Date.now().toString();
        const url = hasQueryParams 
          ? `${imageUrl}&t=${cacheBuster}` 
          : `${imageUrl}?t=${cacheBuster}`;
        
        setUniqueImageUrl(url);
        console.log("DisplayPicture updated with new URL:", url);
      } catch (e) {
        // If the URL is invalid, just use it as is
        setUniqueImageUrl(imageUrl);
        console.log("DisplayPicture using non-URL format:", imageUrl);
      }
    } else {
      setUniqueImageUrl(undefined);
    }
  }, [imageUrl]);
  
  // Size classes mapping
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40"
  };

  // Only show edit field if admin and onUpdate is provided
  const handleImageUpdate = (isAdmin && onUpdate) ? (
    <div className="mt-2">
      <EditableField
        value={uniqueImageUrl || ""}
        onChange={onUpdate}
        className="text-xs opacity-60"
        label="Image URL"
        placeholder="https://example.com/your-image.jpg"
      />
    </div>
  ) : null;

  return (
    <div className="flex flex-col items-center">
      <Avatar className={`${sizeClasses[size]} border-2 ${borderColor} shadow-lg`}>
        <AvatarImage 
          src={uniqueImageUrl} 
          alt={name} 
          className="object-cover" 
          onError={() => {
            console.error("Failed to load profile image:", uniqueImageUrl);
            setImageError(true);
          }}
        />
        <AvatarFallback className="bg-gradient-to-r from-brand-red to-[#FF6B81] text-white text-lg sm:text-xl lg:text-2xl">
          {imageError || !uniqueImageUrl ? getInitials(name) : <User />}
        </AvatarFallback>
      </Avatar>
      {handleImageUpdate}
      
      {uniqueImageUrl && isAdmin && (
        <p className="mt-1 text-xs text-gray-400 max-w-[300px] truncate">
          {uniqueImageUrl.split('?')[0]}
        </p>
      )}
    </div>
  );
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default DisplayPicture;

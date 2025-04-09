
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/FileUpload";
import DesignStyleSelector from "@/components/DesignStyleSelector";
import { User } from "lucide-react";
import { validateProfileImage } from "@/utils/fileValidation";
import { toast } from "sonner";

interface UploadFormContentProps {
  file: File | null;
  cvText: string;
  linkedInUrl: string;
  designStyle: string;
  profileImage: File | null;
  onFileSelect: (file: File) => void;
  onTextExtracted: (text: string) => void;
  onLinkedInChange: (url: string) => void;
  onStyleSelect: (style: string) => void;
  onProfileImageSelect: (file: File | null) => void;
  onProcess: () => void;
}

const UploadFormContent: React.FC<UploadFormContentProps> = ({
  file,
  cvText,
  linkedInUrl,
  designStyle,
  profileImage,
  onFileSelect,
  onTextExtracted,
  onLinkedInChange,
  onStyleSelect,
  onProfileImageSelect,
  onProcess
}) => {
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      if (validateProfileImage(selectedImage)) {
        onProfileImageSelect(selectedImage);
        toast.success("Profile image selected");
      }
    } else {
      onProfileImageSelect(null);
    }
  };
  
  const removeProfileImage = () => {
    onProfileImageSelect(null);
    toast.info("Profile image removed");
  };

  return (
    <div className="space-y-8">
      <div className="glass p-10 rounded-xl">
        <FileUpload 
          onFileSelect={onFileSelect} 
          onTextExtracted={onTextExtracted}
        />
      </div>
      
      {file && cvText && (
        <>
          <div className="glass p-10 rounded-xl">
            <h3 className="text-xl font-medium mb-4">Additional Information</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="linkedInUrl" className="block text-sm font-medium mb-1">
                  LinkedIn URL (optional)
                </label>
                <Input
                  id="linkedInUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedInUrl}
                  onChange={(e) => onLinkedInChange(e.target.value)}
                  className="w-full bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Add your LinkedIn profile URL to link it in your professional website
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Picture (optional)
                </label>
                
                {profileImage ? (
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/20">
                      <img 
                        src={URL.createObjectURL(profileImage)} 
                        alt="Profile preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-gray-300 font-mono truncate max-w-xs">
                        {profileImage.name}
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={removeProfileImage}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <label 
                        htmlFor="profileImage" 
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-red hover:bg-brand-red/90 h-9 px-4 py-2"
                      >
                        Upload Image
                        <input
                          id="profileImage"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Add a professional photo to your website
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="glass p-10 rounded-xl">
            <DesignStyleSelector 
              selectedStyle={designStyle}
              onStyleSelect={onStyleSelect}
            />
          </div>
        </>
      )}
      
      <div className="mt-8 text-center">
        <Button 
          onClick={onProcess} 
          disabled={!file || !cvText} 
          className="bg-brand-red hover:bg-brand-red/90 disabled:bg-gray-600 disabled:cursor-not-allowed"
          size="lg"
        >
          Create My Website
        </Button>
      </div>
    </div>
  );
};

export default UploadFormContent;

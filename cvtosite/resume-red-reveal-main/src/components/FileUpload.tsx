
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FileDropzone from "./upload/FileDropzone";
import FileDisplay from "./upload/FileDisplay";
import { validateFile } from "@/utils/fileValidation";
import { extractTextFromFile } from "@/utils/textExtraction";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTextExtracted: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onTextExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (droppedFile: File) => {
    setIsDragging(false);
    
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
      await extractTextFromFile(droppedFile).then(processExtractedText).catch(handleExtractionError);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
        await extractTextFromFile(selectedFile).then(processExtractedText).catch(handleExtractionError);
      }
    }
  };

  const processExtractedText = async (text: string) => {
    setIsExtracting(true);
    setExtractionError(null);
    
    try {
      // Check if we actually got some meaningful text
      if (!text || text.trim().length < 50) {
        throw new Error("Could not extract sufficient text from the file. The file might be corrupted, password-protected, or primarily image-based.");
      }
      
      console.log("Extracted text:", text.substring(0, 200) + "...");
      onTextExtracted(text);
    } catch (error) {
      handleExtractionError(error);
    } finally {
      setIsExtracting(false);
    }
  };
  
  const handleExtractionError = (error: unknown) => {
    console.error("Error extracting text:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to extract text from file";
    setExtractionError(errorMessage);
    toast.error(errorMessage);
    setIsExtracting(false);
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRetry = async () => {
    if (file) {
      setExtractionError(null);
      await extractTextFromFile(file).then(processExtractedText).catch(handleExtractionError);
    }
  };

  return (
    <FileDropzone 
      onDrop={handleDrop} 
      isDragging={isDragging}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-brand-red/20 to-purple-500/20 p-5 relative group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-red group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-red/20 to-purple-500/20 blur-md -z-10 animate-pulse-soft"></div>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-1 text-gradient-white">Drag & Drop your CV</h3>
          <p className="text-sm text-gray-400">PDF, Word documents, or text files up to 10MB</p>
        </div>
        
        {file ? (
          <FileDisplay 
            file={file} 
            isExtracting={isExtracting} 
            extractionError={extractionError}
            onRetry={handleRetry}
          />
        ) : (
          <div className="mt-2">
            <Button 
              type="button" 
              className="bg-gradient-to-r from-brand-red to-[#FF6B81] hover:from-[#FF5A6E] hover:to-[#FF7D90] animate-glow"
              onClick={handleButtonClick}
            >
              Select File
            </Button>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
        )}
      </div>
    </FileDropzone>
  );
};

export default FileUpload;

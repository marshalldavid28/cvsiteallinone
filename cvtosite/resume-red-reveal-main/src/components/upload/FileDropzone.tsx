
import React, { ReactNode, DragEvent, useState } from "react";

interface FileDropzoneProps {
  onDrop: (file: File) => void;
  children: ReactNode;
  isDragging?: boolean;
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ 
  onDrop, 
  children, 
  isDragging = false,
  className = ""
}) => {
  const [internalDragging, setInternalDragging] = useState(false);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!internalDragging) {
      setInternalDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setInternalDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setInternalDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onDrop(droppedFile);
    }
  };

  // Use either external or internal drag state
  const isCurrentlyDragging = isDragging || internalDragging;

  return (
    <div
      className={`neo-glass border-2 border-dashed rounded-lg p-10 text-center transition-all duration-300 gradient-border relative ${
        isCurrentlyDragging ? "border-brand-red bg-brand-red/10" : "border-gray-500/30 hover:border-brand-red/70"
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default FileDropzone;

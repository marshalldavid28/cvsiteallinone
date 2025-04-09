
import React from "react";
import { Button } from "@/components/ui/button";

interface FileDisplayProps {
  file: File;
  isExtracting: boolean;
  extractionError: string | null;
  onRetry: () => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ 
  file, 
  isExtracting, 
  extractionError, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="p-3 mt-2 glass rounded-md flex items-center max-w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-red mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm truncate max-w-[200px] font-mono">{file.name}</span>
        {isExtracting && <span className="ml-2 text-xs text-gray-400 animate-pulse">Extracting text...</span>}
      </div>
      
      {extractionError && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-sm">
          <p className="text-red-300 mb-2">{extractionError}</p>
          <Button 
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-red-500/50 text-red-300 hover:bg-red-500/20"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileDisplay;

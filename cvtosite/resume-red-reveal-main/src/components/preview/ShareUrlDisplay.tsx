
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

interface ShareUrlDisplayProps {
  isLoading: boolean;
  shareUrl: string;
  onCopy: () => void;
  copied: boolean;
}

const ShareUrlDisplay: React.FC<ShareUrlDisplayProps> = ({
  isLoading,
  shareUrl,
  onCopy,
  copied
}) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-md bg-black/30 border border-white/10">
      <div className="text-sm break-all flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
            <span>Generating shareable URL...</span>
          </div>
        ) : (
          shareUrl || "Preparing your shareable URL..."
        )}
      </div>
      <Button 
        size="sm" 
        className="bg-brand-red hover:bg-brand-red/90 flex-shrink-0"
        onClick={onCopy}
        disabled={isLoading || !shareUrl}
      >
        {copied ? <CheckIcon className="h-4 w-4" /> : "Copy URL"}
      </Button>
    </div>
  );
};

export default ShareUrlDisplay;

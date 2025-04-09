
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";

interface ShareExternalLinkProps {
  shareUrl: string;
  isLoading: boolean;
}

const ShareExternalLink: React.FC<ShareExternalLinkProps> = ({ 
  shareUrl, 
  isLoading 
}) => {
  return (
    <div className="pt-2 flex justify-end">
      <Button 
        asChild
        variant="outline" 
        className="border-white/20"
        disabled={isLoading || !shareUrl}
      >
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLinkIcon className="h-4 w-4 mr-2" />
          Open in new tab
        </a>
      </Button>
    </div>
  );
};

export default ShareExternalLink;

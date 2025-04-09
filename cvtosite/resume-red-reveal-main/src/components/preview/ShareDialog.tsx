
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WebsiteData } from "@/types/website";
import ShareUrlDisplay from "./ShareUrlDisplay";
import ShareExternalLink from "./ShareExternalLink";
import ShareInfoText from "./ShareInfoText";
import { useShareUrl } from "./useShareUrl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ShareDialogProps {
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  publicShareUrl: string;
  profile: WebsiteData;
  theme?: 'dark' | 'light';
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  showShareDialog,
  setShowShareDialog,
  publicShareUrl,
  profile,
  theme = 'dark'
}) => {
  const {
    isLoading,
    shareUrl,
    copied,
    generateShareableUrl,
    handleCopyLink,
    customSlug,
    setCustomSlug,
    slugError,
    checkSlugAvailability,
    existingRecord
  } = useShareUrl(profile, publicShareUrl);
  
  // Generate shareable URL when dialog is opened
  useEffect(() => {
    if (showShareDialog && !shareUrl && !isLoading) {
      console.log('Dialog opened, generating shareable URL');
      // Wait for custom slug to be set first
      // Don't auto-generate until the user has had a chance to set a slug
    }
  }, [showShareDialog, generateShareableUrl, shareUrl, isLoading]);

  const handleCopyAndClose = () => {
    handleCopyLink();
    setShowShareDialog(false);
  };
  
  const handleCustomSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and replace spaces with hyphens
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setCustomSlug(value);
  };
  
  const handleCheckSlug = async () => {
    await checkSlugAvailability(customSlug);
  };

  return (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className={`${theme === 'dark' ? 'bg-brand-dark border-brand-purple/30 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle>{existingRecord ? "Update Your CV Website" : "Share Your CV Website"}</DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            {existingRecord 
              ? "Your CV is already published. You can update it or change the custom URL."
              : "Use this public URL to share your CV website with others"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-slug">Custom URL {existingRecord?.custom_slug ? "(currently: " + existingRecord.custom_slug + ")" : "(optional)"}</Label>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 text-sm text-gray-500">{window.location.origin}/</div>
              <Input
                id="custom-slug"
                placeholder="your-name"
                value={customSlug}
                onChange={handleCustomSlugChange}
                className={`flex-1 ${theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-white/90 border-gray-300'}`}
                maxLength={32}
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-shrink-0"
                onClick={handleCheckSlug}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {slugError && (
              <p className="text-xs text-red-500 mt-1">{slugError}</p>
            )}
            <p className="text-xs text-gray-500">
              Choose a memorable URL for your CV website. Only lowercase letters, numbers, and hyphens allowed.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={generateShareableUrl} 
              disabled={isLoading}
              className="bg-brand-red hover:bg-brand-red/90"
            >
              {isLoading ? "Processing..." : existingRecord 
                ? customSlug !== (existingRecord.custom_slug || "") ? "Update URL" : "Republish CV" 
                : "Generate URL"}
            </Button>
          </div>
          
          {shareUrl && (
            <>
              <ShareUrlDisplay 
                isLoading={isLoading} 
                shareUrl={shareUrl} 
                onCopy={handleCopyAndClose} 
                copied={copied}
              />
              
              <ShareExternalLink 
                shareUrl={shareUrl} 
                isLoading={isLoading} 
              />
            </>
          )}
          
          <ShareInfoText />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;

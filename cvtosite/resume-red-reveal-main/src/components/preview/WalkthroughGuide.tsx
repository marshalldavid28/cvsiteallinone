
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon, MessageSquareIcon, ZapIcon } from "lucide-react";

interface WalkthroughGuideProps {
  isEditMode: boolean;
}

const WalkthroughGuide: React.FC<WalkthroughGuideProps> = () => {
  const [showIntroModal, setShowIntroModal] = useState(false);

  useEffect(() => {
    try {
      // Check if this is the first time the user is visiting
      const introShown = localStorage.getItem('cv-intro-shown');
      if (!introShown) {
        console.log("First time visit detected, showing intro modal");
        setShowIntroModal(true);
      } else {
        console.log("Intro has been shown before");
      }
    } catch (error) {
      console.error("Error checking intro status:", error);
      // Fail gracefully - don't show intro if there's an error
    }
  }, []);

  const handleCloseIntro = () => {
    try {
      localStorage.setItem('cv-intro-shown', 'true');
      setShowIntroModal(false);
    } catch (error) {
      console.error("Error saving intro status:", error);
      setShowIntroModal(false);
    }
  };

  return (
    <Dialog open={showIntroModal} onOpenChange={setShowIntroModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Welcome to your CV Builder!</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <PencilIcon size={20} />
              </div>
              <div>
                <p className="font-medium">Edit your CV</p>
                <p className="text-sm text-muted-foreground">Click on "Edit CV" button to start making changes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <PencilIcon size={20} />
              </div>
              <div>
                <p className="font-medium">Inline editing</p>
                <p className="text-sm text-muted-foreground">Hover over any text and click the pencil icon to edit it directly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                <MessageSquareIcon size={20} />
              </div>
              <div>
                <p className="font-medium">AI Assistant</p>
                <p className="text-sm text-muted-foreground">Use our AI Assistant in the bottom right to help modify your CV</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCloseIntro} className="w-full">
            <ZapIcon className="mr-2 h-4 w-4" />
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WalkthroughGuide;


import React, { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import AdminControls from "./AdminControls";
import ShareDialog from "./ShareDialog";
import { WebsiteData } from "@/types/website";

interface PreviewAdminBarProps {
  userId: string;
  isEditMode: boolean;
  toggleEditMode: () => void;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
  profile?: WebsiteData;
}

const PreviewAdminBar: React.FC<PreviewAdminBarProps> = ({ 
  userId,
  isEditMode,
  toggleEditMode,
  theme = 'dark',
  toggleTheme,
  profile
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Function to open the share dialog
  const openShareDialog = () => {
    setShowShareDialog(true);
  };

  return (
    <>
      <AdminControls 
        userId={userId} 
        isEditMode={isEditMode}
        toggleEditMode={toggleEditMode}
        openShareDialog={openShareDialog}
        theme={theme}
        toggleTheme={toggleTheme}
        profile={profile}
      />
      
      {profile && (
        <ShareDialog
          showShareDialog={showShareDialog}
          setShowShareDialog={setShowShareDialog}
          publicShareUrl=""  // You'll need to provide this
          profile={profile}
          theme={theme}
        />
      )}
    </>
  );
};

export default PreviewAdminBar;

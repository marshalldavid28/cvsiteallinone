
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PencilIcon, CheckIcon, ShareIcon, HomeIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { WebsiteData } from "@/types/website";

interface AdminControlsProps {
  userId: string;
  isEditMode: boolean;
  toggleEditMode: () => void;
  openShareDialog: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  profile: WebsiteData;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  userId,
  isEditMode,
  toggleEditMode,
  openShareDialog,
  theme = 'dark',
  toggleTheme,
  profile
}) => {
  return (
    <div className={`sticky top-0 z-50 p-3 border-b ${theme === 'dark' ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md flex flex-wrap items-center justify-between gap-2`}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={isEditMode ? "default" : "outline"}
          onClick={toggleEditMode}
          className="flex items-center gap-1"
        >
          {isEditMode ? <CheckIcon size={16} /> : <PencilIcon size={16} />}
          {isEditMode ? "Save Changes" : "Edit CV"}
        </Button>
        
        <Button
          variant="outline"
          onClick={openShareDialog}
          className="flex items-center gap-1"
        >
          <ShareIcon size={16} />
          Share CV
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <HomeIcon size={18} />
        </Link>
        
        {toggleTheme && (
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        )}
      </div>
    </div>
  );
};

export default AdminControls;



import React, { useEffect } from "react";
import { WebsiteData } from "@/types/website";
import PreviewAdminBar from "./PreviewAdminBar";
import AIEditAssistant from "./AIEditAssistant";
import WalkthroughGuide from "./WalkthroughGuide";
import { toast } from "sonner";

interface PreviewLayoutProps {
  userId: string;
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  profile: WebsiteData;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  children: React.ReactNode;
  onProfileUpdate: (updatedProfile: WebsiteData) => void;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = ({
  userId,
  isAdmin,
  isEditMode,
  toggleEditMode,
  profile,
  theme,
  toggleTheme,
  children,
  onProfileUpdate
}) => {
  // Check for optimization notes and show them as a toast
  // But ONLY when in admin/edit mode, not for shared public URLs
  useEffect(() => {
    try {
      // Only show optimization notes when the user is in admin mode
      // This prevents notes from showing up when someone views a shared URL
      if (isAdmin && profile.optimizationNotes) {
        // Show the notes and then remove them from the profile
        const notesToShow = profile.optimizationNotes;
        
        // Show a short version with option to see more
        const shortNotes = notesToShow.length > 150 
          ? notesToShow.substring(0, 150) + '...' 
          : notesToShow;
          
        toast.info(
          <div>
            <p className="font-bold mb-1">CV Optimization Tips</p>
            <p>{shortNotes}</p>
            {notesToShow.length > 150 && (
              <button 
                className="mt-2 text-brand-red hover:underline text-sm"
                onClick={() => {
                  toast.info(
                    <div className="max-h-[50vh] overflow-y-auto">
                      <p className="font-bold mb-2">Complete CV Optimization Notes</p>
                      <p className="whitespace-pre-line">{notesToShow}</p>
                    </div>,
                    { 
                      duration: 10000,
                      dismissible: true
                    }
                  );
                }}
              >
                Show more details
              </button>
            )}
          </div>,
          { 
            duration: 7000,
            dismissible: true
          }
        );
        
        // Remove the notes from the profile to avoid showing them again
        const updatedProfile = {...profile};
        delete updatedProfile.optimizationNotes;
        onProfileUpdate(updatedProfile);
        
        // Also store in localStorage for potential backup
        localStorage.setItem('cvOptimizationNotes', notesToShow);
      }
    } catch (error) {
      console.error("Error handling optimization notes:", error);
    }
  }, [profile, onProfileUpdate, isAdmin]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-brand-darker' : 'bg-gray-50'}`}>
      {isAdmin && (
        <PreviewAdminBar
          userId={userId}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          theme={theme}
          toggleTheme={toggleTheme}
          profile={profile}
        />
      )}
      {children}
      
      {/* Show intro modal only for admin users */}
      {isAdmin && (
        <WalkthroughGuide isEditMode={isEditMode} />
      )}
      
      {/* Show AI Assistant only in edit mode */}
      {isAdmin && isEditMode && (
        <AIEditAssistant 
          profile={profile}
          onProfileUpdate={onProfileUpdate}
          theme={theme}
        />
      )}
    </div>
  );
};

export default PreviewLayout;

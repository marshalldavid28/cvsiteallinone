import React, { useEffect, useState } from "react";
import { WebsiteData } from "@/types/website";
import { Styles } from "./StyleUtils";
import Header from "./Header";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import Projects from "./Projects";
import CustomSections from "./CustomSections";
import Footer from "./Footer";
import ShareDialog from "./ShareDialog";
import WalkthroughGuide from "./WalkthroughGuide";
import PDFDownloadButton from "./PDFDownloadButton";
import TwoColumnCV from "./TwoColumnCV";
import ViewToggle from "./ViewToggle";

interface PreviewContentProps {
  profile: WebsiteData;
  styles: Styles;
  isAdmin: boolean;
  isEditMode: boolean;
  isLoading?: boolean;
  onProfileUpdate: (field: string, value: string) => void;
  toggleEditMode?: () => void;
  theme: 'dark' | 'light';
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  profile,
  styles,
  isAdmin,
  isEditMode,
  isLoading = false,
  onProfileUpdate,
  toggleEditMode,
  theme
}) => {
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [view, setView] = useState<"standard" | "two-column">("standard");
  
  // Get the current URL and strip any query parameters
  const currentUrl = new URL(window.location.href);
  const baseUrl = `${currentUrl.origin}${currentUrl.pathname}`;
  const publicShareUrl = baseUrl.replace(/\/$/, "");
  
  const openShareDialog = () => setShowShareDialog(true);
  
  // Listen for the custom event to open the share dialog
  useEffect(() => {
    const handleOpenShareDialog = () => {
      setShowShareDialog(true);
    };
    
    window.addEventListener('openShareDialog', handleOpenShareDialog);
    
    return () => {
      window.removeEventListener('openShareDialog', handleOpenShareDialog);
    };
  }, []);

  // Determine if bio content is available and not empty
  const hasBioContent = profile.bio && profile.bio.trim().length > 0;

  if (isLoading) {
    return (
      <div className={`flex-grow flex items-center justify-center min-h-[50vh] ${theme === 'dark' ? 'bg-brand-darker' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full border-4 border-t-transparent ${theme === 'dark' ? 'border-brand-purple' : 'border-brand-red'} animate-spin mx-auto mb-4`}></div>
          <h2 className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading CV Website...</h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Please wait while we retrieve the data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-grow ${theme === 'dark' ? 'bg-brand-darker' : 'bg-gray-50'}`}>
      {isAdmin && <WalkthroughGuide isEditMode={isEditMode} />}
      
      {/* Controls row with PDF Download Button and View Toggle */}
      <div className="flex justify-between px-4 pt-4 items-center">
        <ViewToggle 
          currentView={view} 
          onViewChange={setView}
          theme={theme}
        />
        <PDFDownloadButton 
          profile={profile} 
          theme={theme} 
          view={view}
        />
      </div>
      
      {/* Standard View */}
      {view === "standard" ? (
        <div className="pdf-printable-area">
          <Header 
            profile={profile} 
            styles={styles} 
            isAdmin={isAdmin && isEditMode} 
            onProfileUpdate={onProfileUpdate} 
          />
          
          <main className={`py-8 px-4 sm:py-12 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-gray-50'}`}>
            <div className="max-w-5xl mx-auto">
              {/* WORK EXPERIENCE SECTION - Ensure this is properly marked for PDF extraction */}
              <div className="experience-section">
                <Experience 
                  experiences={profile.experience} 
                  styles={styles} 
                  isAdmin={isAdmin && isEditMode}
                  onProfileUpdate={onProfileUpdate}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 education-skills-section">
                <div className="education-subsection">
                  <Education 
                    educations={profile.education} 
                    styles={styles}
                    isAdmin={isAdmin && isEditMode}
                    onProfileUpdate={onProfileUpdate} 
                  />
                </div>
                
                {/* Only render Skills section if there are skills or we're in edit mode */}
                {(profile.skills?.length > 0 || (isAdmin && isEditMode)) && (
                  <div className="skills-subsection">
                    <Skills 
                      skills={profile.skills || []} 
                      languages={profile.languages} 
                      styles={styles}
                      isAdmin={isAdmin && isEditMode}
                      onProfileUpdate={onProfileUpdate}
                    />
                  </div>
                )}
              </div>
              
              {profile.projects && profile.projects.length > 0 && (
                <div className="projects-section">
                  <Projects 
                    projects={profile.projects} 
                    styles={styles}
                    isAdmin={isAdmin && isEditMode}
                    onProfileUpdate={onProfileUpdate} 
                  />
                </div>
              )}
              
              {profile.customSections && profile.customSections.length > 0 && (
                <div className="custom-sections">
                  <CustomSections 
                    sections={profile.customSections} 
                    styles={styles}
                    isAdmin={isAdmin && isEditMode}
                    onProfileUpdate={onProfileUpdate}
                  />
                </div>
              )}
            </div>
          </main>
          
          <Footer name={profile.name} theme={theme} />
        </div>
      ) : (
        // Two Column CV View - Always in Light Mode
        <TwoColumnCV 
          profile={profile} 
          theme="light"
        />
      )}
      
      {/* Public URL Share Dialog */}
      <ShareDialog 
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        publicShareUrl={publicShareUrl}
        profile={profile}
        theme={theme}
      />
    </div>
  );
};

export default PreviewContent;

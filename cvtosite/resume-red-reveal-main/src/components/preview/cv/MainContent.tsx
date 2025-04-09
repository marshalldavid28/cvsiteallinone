
import React from "react";
import { WebsiteData } from "@/types/website";
import { CVColorStyles } from "./CVColorScheme";
import ProfileHeader from "./ProfileHeader";
import ExperienceTimeline from "./ExperienceTimeline";
import ProjectsGrid from "./ProjectsGrid";
import CustomSectionsList from "./CustomSectionsList";

interface MainContentProps {
  profile: WebsiteData;
  colorStyles: CVColorStyles;
}

const MainContent: React.FC<MainContentProps> = ({ 
  profile, 
  colorStyles 
}) => {
  return (
    <div>
      {/* Header with name and title */}
      <div className="mb-8 cv-header-section">
        <ProfileHeader 
          name={profile.name} 
          title={profile.title} 
          displayPicture={profile.displayPicture} 
          colorStyles={colorStyles} 
        />
        
        {/* Profile/Bio section */}
        {profile.bio && (
          <div className="cv-bio-section mt-4">
            <h2 className={`text-lg uppercase mb-2 ${colorStyles.sectionHeader}`}>Profile</h2>
            <p className={`${colorStyles.text} leading-relaxed`}>{profile.bio}</p>
          </div>
        )}
      </div>
      
      {/* Experience section */}
      <ExperienceTimeline 
        experience={profile.experience} 
        colorStyles={colorStyles} 
      />
      
      {/* Projects section */}
      <ProjectsGrid 
        projects={profile.projects} 
        colorStyles={colorStyles} 
      />
      
      {/* Custom sections */}
      <CustomSectionsList 
        customSections={profile.customSections} 
        colorStyles={colorStyles} 
      />
    </div>
  );
};

export default MainContent;

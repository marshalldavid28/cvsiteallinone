
import React from "react";
import DisplayPicture from "../DisplayPicture";
import { WebsiteData } from "@/types/website";
import { CVColorStyles } from "./CVColorScheme";
import ContactInfo from "./ContactInfo";
import SkillsList from "./SkillsList";
import LanguagesList from "./LanguagesList";
import EducationList from "./EducationList";

interface ProfileSidebarProps {
  profile: WebsiteData;
  colorStyles: CVColorStyles;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  profile, 
  colorStyles 
}) => {
  // Check if we have a display picture to show
  const hasDisplayPicture = !!profile.displayPicture;
  
  return (
    <div className="flex flex-col h-full">
      {/* Profile image - only show if there's an image URL */}
      {hasDisplayPicture && (
        <div className="flex justify-center mb-6">
          <DisplayPicture 
            imageUrl={profile.displayPicture}
            name={profile.name}
            size="lg"
            borderColor="border-gray-300"
          />
        </div>
      )}
      
      {/* Contact section */}
      <div className="mb-6">
        <ContactInfo contact={profile.contact} colorStyles={colorStyles} />
      </div>
      
      {/* Skills section */}
      <div className="mb-6">
        <SkillsList skills={profile.skills} colorStyles={colorStyles} />
      </div>
      
      {/* Languages section */}
      <div className="mb-6">
        <LanguagesList languages={profile.languages} colorStyles={colorStyles} />
      </div>
      
      {/* Education section */}
      <div>
        <EducationList education={profile.education} colorStyles={colorStyles} />
      </div>
    </div>
  );
};

export default ProfileSidebar;

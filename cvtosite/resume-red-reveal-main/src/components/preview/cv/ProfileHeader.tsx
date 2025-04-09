
import React from "react";
import DisplayPicture from "../DisplayPicture";

interface ProfileHeaderProps {
  name: string;
  title: string;
  displayPicture?: string;
  colorStyles: {
    headerText: string;
    accent: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  name, 
  title, 
  displayPicture,
  colorStyles
}) => {
  return (
    <div className="mb-6 border-b pb-4 border-gray-200">
      <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${colorStyles.headerText}`}>
        {name}
      </h1>
      <p className={`text-xl ${colorStyles.accent} uppercase tracking-wider mt-1`}>
        {title}
      </p>
    </div>
  );
};

export default ProfileHeader;

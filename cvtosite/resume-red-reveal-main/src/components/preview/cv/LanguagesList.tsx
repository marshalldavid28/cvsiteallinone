
import React from "react";

interface LanguagesListProps {
  languages?: string[];
  colorStyles: {
    text: string;
    sectionHeader: string;
  };
}

const LanguagesList: React.FC<LanguagesListProps> = ({ 
  languages, 
  colorStyles 
}) => {
  if (!languages || languages.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>Languages</h2>
      <ul className={`${colorStyles.text} space-y-1`}>
        {languages.map((language, index) => (
          <li key={index} className="text-sm">{language}</li>
        ))}
      </ul>
    </div>
  );
};

export default LanguagesList;

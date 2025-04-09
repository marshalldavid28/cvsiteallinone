
import React from "react";
import { Education } from "@/types/website";
import { GraduationCap, Calendar } from "lucide-react";

interface EducationListProps {
  education: Education[];
  colorStyles: {
    text: string;
    headerText: string;
    subtext: string;
    accent: string;
    sectionHeader: string;
  };
}

const EducationList: React.FC<EducationListProps> = ({ 
  education, 
  colorStyles 
}) => {
  if (!education || education.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className={colorStyles.accent} />
              <h3 className={`font-medium ${colorStyles.headerText}`}>{edu.degree}</h3>
            </div>
            <p className={`${colorStyles.headerText} text-sm mb-1`}>{edu.institution}</p>
            <p className={`${colorStyles.subtext} text-sm flex items-center gap-1`}>
              <Calendar size={14} />
              {edu.year}
            </p>
            {edu.description && (
              <p className={`${colorStyles.text} text-sm mt-2`}>{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationList;

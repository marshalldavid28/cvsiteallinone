
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SkillsListProps {
  skills: string[];
  colorStyles: {
    text: string;
    badge: string;
    sectionHeader: string;
  };
}

const SkillsList: React.FC<SkillsListProps> = ({ 
  skills, 
  colorStyles 
}) => {
  if (!skills || skills.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className={`${colorStyles.badge} py-1 px-3 whitespace-nowrap inline-flex items-center`}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;

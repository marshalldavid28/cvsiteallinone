
import React from "react";
import { Experience } from "@/types/website";
import { Building, Calendar } from "lucide-react";

interface ExperienceTimelineProps {
  experience: Experience[];
  colorStyles: {
    text: string;
    headerText: string;
    subtext: string;
    accent: string;
    badge: string;
    border: string;
    sectionHeader: string;
  };
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ 
  experience, 
  colorStyles 
}) => {
  if (!experience || experience.length === 0) return null;
  
  return (
    <div className="mb-8 two-column-experience-section">
      <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>Work Experience</h2>
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div 
            key={index} 
            className={`two-column-experience-item ${index < experience.length - 1 ? `pb-6 border-b ${colorStyles.border}` : ""}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start mb-2">
              <div>
                <h3 className={`font-bold ${colorStyles.headerText}`}>{exp.title}</h3>
                <p className={`${colorStyles.headerText} mt-1`}>
                  <span className="inline-flex items-center gap-2">
                    <Building size={16} className={colorStyles.accent} />
                    <span>{exp.company}</span>
                  </span>
                </p>
              </div>
              <div className={`${colorStyles.subtext} text-sm px-3 py-1 rounded ${colorStyles.badge} inline-flex items-center gap-2 mt-2 md:mt-0 whitespace-nowrap`}>
                <Calendar size={16} />
                <span>{exp.period}</span>
              </div>
            </div>
            <p className={`${colorStyles.text} mt-2`}>{exp.description}</p>
            
            {exp.details && exp.details.length > 0 && (
              <ul className={`${colorStyles.text} mt-3 space-y-1 list-disc pl-5`}>
                {exp.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="text-sm pl-1">
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTimeline;

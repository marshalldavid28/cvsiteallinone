
import React from "react";
import { CustomSection } from "@/types/website";

interface CustomSectionsListProps {
  customSections?: CustomSection[];
  colorStyles: {
    text: string;
    headerText: string;
    subtext: string;
    accent: string;
    sectionHeader: string;
  };
}

const CustomSectionsList: React.FC<CustomSectionsListProps> = ({ 
  customSections, 
  colorStyles 
}) => {
  if (!customSections || customSections.length === 0) return null;
  
  return (
    <div className="space-y-8">
      {customSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="custom-section mb-6">
          <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>{section.title}</h2>
          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex flex-col custom-section-item">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${colorStyles.headerText}`}>{item.name}</h3>
                  {item.date && (
                    <span className={`${colorStyles.subtext} text-sm`}>{item.date}</span>
                  )}
                </div>
                {item.description && (
                  <p className={`${colorStyles.text} text-sm mt-1`}>{item.description}</p>
                )}
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm ${colorStyles.accent} hover:underline mt-1 inline-block`}
                  >
                    Learn More
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomSectionsList;

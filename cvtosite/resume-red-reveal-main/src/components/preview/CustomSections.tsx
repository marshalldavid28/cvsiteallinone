
import React from 'react';
import { CustomSection } from '@/types/website';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Linkedin } from 'lucide-react';
import EditableField from './EditableField';

interface CustomSectionsProps {
  sections: CustomSection[];
  styles: {
    cardBg: string;
    titleColor: string;
    [key: string]: string;
  };
  isAdmin?: boolean;
  onProfileUpdate?: (field: string, value: string) => void;
}

const CustomSections: React.FC<CustomSectionsProps> = ({ 
  sections, 
  styles, 
  isAdmin = false, 
  onProfileUpdate 
}) => {
  if (!sections || sections.length === 0) return null;
  
  return (
    <>
      {sections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white border-b border-brand-red/50 pb-2">
            {isAdmin && onProfileUpdate ? (
              <EditableField
                value={section.title}
                onChange={(newValue) => onProfileUpdate(`customSections[${sectionIndex}].title`, newValue)}
                className="inline-flex"
                label="Section Title"
              />
            ) : (
              section.title
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {section.items.map((item, itemIndex) => (
              <div 
                key={itemIndex} 
                className={`
                  ${styles.cardBg} 
                  p-4 sm:p-6 
                  rounded-xl
                  transition-all 
                  duration-300 
                  ease-in-out
                  hover:shadow-card-hover 
                  dark:hover:shadow-card-hover-dark
                  hover:-translate-y-1
                  hover:before:opacity-100
                  relative
                  before:absolute before:inset-0 before:rounded-xl 
                  before:opacity-0 before:transition-opacity before:duration-300
                  before:shadow-glow-red-light dark:before:shadow-glow-red
                `}
              >
                <Accordion type="single" collapsible defaultValue="item-0" className="border-none">
                  <AccordionItem value={`item-${itemIndex}`} className="border-none">
                    <div className="flex flex-col sm:flex-row justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {isAdmin && onProfileUpdate ? (
                          <EditableField
                            value={item.name}
                            onChange={(newValue) => onProfileUpdate(`customSections[${sectionIndex}].items[${itemIndex}].name`, newValue)}
                            className="inline-flex"
                            label="Item Name"
                          />
                        ) : (
                          item.name
                        )}
                      </h3>
                      {item.date && (
                        <span className={`${styles.titleColor} text-sm sm:text-base mt-1 sm:mt-0`}>
                          {isAdmin && onProfileUpdate ? (
                            <EditableField
                              value={item.date}
                              onChange={(newValue) => onProfileUpdate(`customSections[${sectionIndex}].items[${itemIndex}].date`, newValue)}
                              className="inline-flex"
                              label="Date"
                            />
                          ) : (
                            item.date
                          )}
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <AccordionContent className="px-0">
                        <p className="text-gray-300 mb-3 text-sm sm:text-base">
                          {isAdmin && onProfileUpdate ? (
                            <EditableField
                              value={item.description}
                              onChange={(newValue) => onProfileUpdate(`customSections[${sectionIndex}].items[${itemIndex}].description`, newValue)}
                              className="w-full"
                              multiline
                              label="Description"
                            />
                          ) : (
                            item.description
                          )}
                        </p>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                </Accordion>
                
                <div className="flex flex-wrap gap-2">
                  {item.url && (
                    <>
                      {isAdmin && onProfileUpdate ? (
                        <EditableField
                          value={item.url}
                          onChange={(newValue) => onProfileUpdate(`customSections[${sectionIndex}].items[${itemIndex}].url`, newValue)}
                          className="inline-flex"
                          label="URL"
                        />
                      ) : (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-red hover:text-brand-red/80 text-sm inline-flex items-center gap-1"
                        >
                          Learn More
                        </a>
                      )}
                    </>
                  )}
                  
                  {/* Special handling for LinkedIn URLs */}
                  {(section.title.toLowerCase().includes('linkedin') || 
                   item.name.toLowerCase().includes('linkedin') || 
                   (item.url && item.url.toLowerCase().includes('linkedin'))) && (
                    <a 
                      href={item.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:text-[#0A66C2]/80 text-sm inline-flex items-center gap-1"
                    >
                      <Linkedin size={16} />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default CustomSections;

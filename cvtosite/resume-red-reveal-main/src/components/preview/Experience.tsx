
import React, { useState } from 'react';
import { Experience as ExperienceType } from '@/types/website';
import { ChevronDown } from 'lucide-react';
import EditableField from './EditableField';

interface ExperienceProps {
  experiences: ExperienceType[];
  styles: {
    cardBg: string;
    titleColor: string;
    textColor: string;
    subtextColor: string;
    [key: string]: string;
  };
  isAdmin?: boolean;
  onProfileUpdate?: (field: string, value: string) => void;
}

const Experience: React.FC<ExperienceProps> = ({ experiences, styles, isAdmin = false, onProfileUpdate }) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  
  const joinItems = (items: string[] | undefined): string => {
    if (!items) return '';
    return items.join('\n');
  };
  
  const handleDetailsUpdate = (index: number, value: string) => {
    if (onProfileUpdate) {
      const detailsArray = value.split('\n')
        .map(item => item.trim())
        .filter(item => item);
      
      onProfileUpdate(`experience[${index}].details`, JSON.stringify(detailsArray));
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndexes(prev => {
      const isCurrentlyExpanded = prev.includes(index);
      if (isCurrentlyExpanded) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Handle empty or undefined experience array
  const experiencesToRender = experiences || [];

  return (
    <section className="mb-12 sm:mb-16 experience-section">
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${styles.textColor} border-b border-brand-red/50 pb-2`}>Work Experience</h2>
      <div className="space-y-6 sm:space-y-8">
        {experiencesToRender.map((exp, index) => (
          <div 
            key={index} 
            className={`
              experience-item
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
            <div className="flex flex-col sm:flex-row justify-between mb-2">
              <h3 className={`text-lg sm:text-xl font-semibold ${styles.textColor}`}>
                {isAdmin && onProfileUpdate ? (
                  <div className="relative z-20">
                    <EditableField
                      value={exp.title || ''}
                      onChange={(newValue) => onProfileUpdate(`experience[${index}].title`, newValue)}
                      className="inline-flex"
                      label="Job Title"
                    />
                  </div>
                ) : (
                  exp.title
                )}
              </h3>
              <span className={`${styles.titleColor} text-sm sm:text-base mt-1 sm:mt-0`}>
                {isAdmin && onProfileUpdate ? (
                  <div className="relative z-20">
                    <EditableField
                      value={exp.period || ''}
                      onChange={(newValue) => onProfileUpdate(`experience[${index}].period`, newValue)}
                      className="inline-flex"
                      label="Period"
                    />
                  </div>
                ) : (
                  exp.period
                )}
              </span>
            </div>
            <div className={`${styles.subtextColor} mb-3`}>
              {isAdmin && onProfileUpdate ? (
                <div className="relative z-20">
                  <EditableField
                    value={exp.company || ''}
                    onChange={(newValue) => onProfileUpdate(`experience[${index}].company`, newValue)}
                    className="inline-flex"
                    label="Company"
                  />
                </div>
              ) : (
                exp.company
              )}
            </div>
            
            {/* Description */}
            <div className={styles.subtextColor}>
              {isAdmin && onProfileUpdate ? (
                <div className="relative z-20">
                  <EditableField
                    value={exp.description || ''}
                    onChange={(newValue) => onProfileUpdate(`experience[${index}].description`, newValue)}
                    className="w-full"
                    multiline
                    label="Description"
                  />
                </div>
              ) : (
                <p>{exp.description}</p>
              )}
            </div>
            
            {/* Show more section - only render if there are details or in admin mode */}
            {(isAdmin || (exp.details && exp.details.length > 0)) && (
              <div className="mt-3">
                <button 
                  onClick={() => toggleExpand(index)}
                  className={`${styles.titleColor} hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer z-10 relative print:hidden`}
                  type="button"
                  aria-expanded={expandedIndexes.includes(index)}
                >
                  <span>Show more</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${expandedIndexes.includes(index) ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <div className={expandedIndexes.includes(index) || isAdmin ? "mt-4" : "mt-4 hidden print:block"}>
                  {isAdmin && onProfileUpdate ? (
                    <div className="relative z-20">
                      <EditableField
                        value={joinItems(exp.details)}
                        onChange={(newValue) => handleDetailsUpdate(index, newValue)}
                        className="w-full"
                        multiline
                        label="Details (one per line)"
                      />
                    </div>
                  ) : (
                    exp.details && exp.details.length > 0 && (
                      <ul className={`list-disc pl-5 space-y-2 ${styles.subtextColor}`}>
                        {exp.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )
                  )}
                  
                  {isAdmin && (
                    <div className="text-xs text-gray-500 mt-2">
                      ID: experience[{index}]
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;

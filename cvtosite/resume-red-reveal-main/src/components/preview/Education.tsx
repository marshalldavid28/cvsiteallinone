
import React from 'react';
import { Education as EducationType } from '@/types/website';
import EditableField from './EditableField';

interface EducationProps {
  educations: EducationType[];
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

const Education: React.FC<EducationProps> = ({ educations, styles, isAdmin = false, onProfileUpdate }) => {
  return (
    <div className="mb-12 sm:mb-16">
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${styles.textColor} border-b border-brand-red/50 pb-2`}>Education</h2>
      <div className="space-y-4 sm:space-y-6">
        {educations.map((edu, index) => (
          <div 
            key={index} 
            className={`
              ${styles.cardBg} 
              p-4 sm:p-5 
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
            <h3 className={`text-base sm:text-lg font-semibold ${styles.textColor}`}>
              {isAdmin && onProfileUpdate ? (
                <div className="relative z-20">
                  <EditableField
                    value={edu.degree}
                    onChange={(newValue) => onProfileUpdate(`education[${index}].degree`, newValue)}
                    className="inline-flex"
                    label="Degree"
                  />
                </div>
              ) : (
                edu.degree
              )}
            </h3>
            <p className={styles.subtextColor}>
              {isAdmin && onProfileUpdate ? (
                <div className="relative z-20">
                  <EditableField
                    value={edu.institution}
                    onChange={(newValue) => onProfileUpdate(`education[${index}].institution`, newValue)}
                    className="inline-flex"
                    label="Institution"
                  />
                </div>
              ) : (
                edu.institution
              )}
            </p>
            <p className={`${styles.titleColor} text-sm sm:text-base`}>
              {isAdmin && onProfileUpdate ? (
                <div className="relative z-20">
                  <EditableField
                    value={edu.year}
                    onChange={(newValue) => onProfileUpdate(`education[${index}].year`, newValue)}
                    className="inline-flex"
                    label="Year"
                  />
                </div>
              ) : (
                edu.year
              )}
            </p>
            {edu.description && (
              <p className={`${styles.subtextColor} mt-2 text-sm sm:text-base`}>
                {isAdmin && onProfileUpdate ? (
                  <div className="relative z-20">
                    <EditableField
                      value={edu.description}
                      onChange={(newValue) => onProfileUpdate(`education[${index}].description`, newValue)}
                      className="inline-flex"
                      multiline
                      label="Description"
                    />
                  </div>
                ) : (
                  edu.description
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;

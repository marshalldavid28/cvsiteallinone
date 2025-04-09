
import React from 'react';
import EditableField from './EditableField';

interface SkillsProps {
  skills: string[];
  languages?: string[];
  styles: {
    cardBg: string;
    skillBg: string;
    textColor: string;
    subtextColor: string;
    [key: string]: string;
  };
  isAdmin?: boolean;
  onProfileUpdate?: (field: string, value: string) => void;
}

const Skills: React.FC<SkillsProps> = ({ skills, languages, styles, isAdmin = false, onProfileUpdate }) => {
  // Helper to join array of strings for editing
  const joinItems = (items: string[]): string => (items || []).join(', ');
  
  // Helper to handle updates to comma-separated lists
  const handleListUpdate = (field: string, value: string) => {
    if (onProfileUpdate) {
      // Split by comma and trim each item
      const itemsArray = value.split(',').map(item => item.trim()).filter(item => item);
      onProfileUpdate(field, JSON.stringify(itemsArray));
      
      // Log the operation for debugging
      console.log(`Updated ${field} with ${itemsArray.length} items:`, itemsArray);
    }
  };
  
  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${styles.textColor} border-b border-brand-red/50 pb-2`}>Skills</h2>
      <div className={`
        ${styles.cardBg} 
        p-5 
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
      `}>
        {isAdmin && onProfileUpdate ? (
          <div className="relative z-20">
            <EditableField
              value={joinItems(skills)}
              onChange={(newValue) => handleListUpdate('skills', newValue)}
              className="mb-4 w-full"
              multiline
              label="Skills (comma-separated)"
              placeholder="Add your skills here (e.g. Project Management, Data Analysis, Marketing)"
            />
            {skills.length === 0 && (
              <div className="text-amber-400 text-sm mb-4 bg-amber-500/10 p-2 rounded-md border border-amber-500/20">
                No skills were found in your CV. Add your key skills above to make your profile more complete.
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
            {skills && skills.length > 0 ? (
              skills.map((skill, index) => (
                <span key={index} className={`px-3 py-1 ${styles.skillBg} rounded-full text-sm`}>
                  {skill}
                </span>
              ))
            ) : (
              <p className={`${styles.subtextColor} italic`}>No skills specified</p>
            )}
          </div>
        )}
        
        {languages && languages.length > 0 && (
          <>
            <h3 className={`text-lg font-semibold mb-3 ${styles.textColor}`}>Languages</h3>
            {isAdmin && onProfileUpdate ? (
              <div className="relative z-20">
                <EditableField
                  value={joinItems(languages)}
                  onChange={(newValue) => handleListUpdate('languages', newValue)}
                  className="w-full"
                  multiline
                  label="Languages (comma-separated)"
                />
              </div>
            ) : (
              <ul className={`space-y-1 ${styles.subtextColor}`}>
                {languages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Skills;


import React from 'react';
import { Project } from '@/types/website';
import EditableField from './EditableField';

interface ProjectsProps {
  projects: Project[];
  styles: {
    cardBg: string;
    techBg: string;
    [key: string]: string;
  };
  isAdmin?: boolean;
  onProfileUpdate?: (field: string, value: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, styles, isAdmin = false, onProfileUpdate }) => {
  if (!projects || projects.length === 0) return null;
  
  // Helper to join array of strings for editing
  const joinItems = (items: string[]): string => items.join(', ');
  
  // Helper to handle updates to comma-separated lists
  const handleTechUpdate = (index: number, value: string) => {
    if (onProfileUpdate) {
      // Split by comma and trim each item
      const techArray = value.split(',').map(item => item.trim()).filter(item => item);
      onProfileUpdate(`projects[${index}].technologies`, JSON.stringify(techArray));
    }
  };
  
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-brand-red/50 pb-2">Notable Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className={`
              ${styles.cardBg} 
              p-6 
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
            <h3 className="text-xl font-semibold mb-2">
              {isAdmin && onProfileUpdate ? (
                <EditableField
                  value={project.name}
                  onChange={(newValue) => onProfileUpdate(`projects[${index}].name`, newValue)}
                  className="inline-flex"
                  label="Project Name"
                />
              ) : (
                project.name
              )}
            </h3>
            <p className="text-gray-300 mb-4">
              {isAdmin && onProfileUpdate ? (
                <EditableField
                  value={project.description}
                  onChange={(newValue) => onProfileUpdate(`projects[${index}].description`, newValue)}
                  className="w-full"
                  multiline
                  label="Description"
                />
              ) : (
                project.description
              )}
            </p>
            {isAdmin && onProfileUpdate ? (
              <EditableField
                value={joinItems(project.technologies || [])}
                onChange={(newValue) => handleTechUpdate(index, newValue)}
                className="mb-3 w-full"
                label="Technologies (comma-separated)"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mb-3">
                {(project.technologies || []).map((tech, techIndex) => (
                  <span key={techIndex} className={`px-2 py-1 ${styles.techBg} rounded-md text-xs`}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {project.url && (
              <div className="flex items-center gap-2">
                {isAdmin && onProfileUpdate ? (
                  <EditableField
                    value={project.url}
                    onChange={(newValue) => onProfileUpdate(`projects[${index}].url`, newValue)}
                    className="inline-flex"
                    label="URL"
                  />
                ) : (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-red hover:text-brand-red/80 text-sm inline-flex items-center gap-1"
                  >
                    View Project
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;

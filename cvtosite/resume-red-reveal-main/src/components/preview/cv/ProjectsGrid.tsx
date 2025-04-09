
import React from "react";
import { Project } from "@/types/website";
import { Badge } from "@/components/ui/badge";

interface ProjectsGridProps {
  projects?: Project[];
  colorStyles: {
    text: string;
    headerText: string;
    border: string;
    badge: string;
    accent: string;
    sectionHeader: string;
  };
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ 
  projects, 
  colorStyles 
}) => {
  if (!projects || projects.length === 0) return null;
  
  return (
    <div className="mb-8 cv-projects-section">
      <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>Projects</h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className={`p-4 rounded-lg border ${colorStyles.border} cv-project-item`}>
            <h3 className={`font-bold ${colorStyles.headerText}`}>{project.name}</h3>
            <p className={`${colorStyles.text} text-sm mt-2`}>{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="outline" className={colorStyles.badge}>
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-sm ${colorStyles.accent} hover:underline mt-2 inline-block`}
              >
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;

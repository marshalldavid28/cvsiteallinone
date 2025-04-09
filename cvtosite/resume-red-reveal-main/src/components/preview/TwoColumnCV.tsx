
import React from "react";
import { WebsiteData } from "@/types/website";
import { getAppleInspiredColors } from "./cv/CVColorScheme";
import ProfileSidebar from "./cv/ProfileSidebar";
import MainContent from "./cv/MainContent";

interface TwoColumnCVProps {
  profile: WebsiteData;
  theme?: 'dark' | 'light'; // Make theme optional
}

const TwoColumnCV: React.FC<TwoColumnCVProps> = ({ 
  profile, 
  theme // We will still ignore the theme prop and always use light
}) => {
  // Force light mode for CV view
  const colors = getAppleInspiredColors();

  return (
    <div className="pdf-printable-area w-full min-h-screen bg-white print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto p-6 print:p-0">
        {/* Main container with two columns */}
        <div className="flex flex-col md:flex-row gap-6 rounded-lg overflow-hidden border print:border-0 shadow-sm print:shadow-none">
          {/* Left column - Personal info, skills, education */}
          <div 
            className="w-full md:w-1/3 bg-gray-50 p-6 print:w-1/3 print:p-4 print:bg-gray-100"
            id="cv-left-column"
          >
            <ProfileSidebar profile={profile} colorStyles={colors} />
          </div>
          
          {/* Right column - Name, title, profile, experience */}
          <div 
            className="w-full md:w-2/3 bg-white p-6 print:w-2/3 print:p-4"
            id="cv-right-column"
          >
            <MainContent profile={profile} colorStyles={colors} />
          </div>
        </div>
        
        {/* Footer section for PDF */}
        <div className="hidden print:block mt-6 text-xs text-center text-gray-500">
          Generated with CV Builder • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnCV;

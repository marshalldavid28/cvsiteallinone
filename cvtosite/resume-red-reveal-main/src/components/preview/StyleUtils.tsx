import { WebsiteData } from '@/types/website';

export interface Styles {
  headerBg: string;
  cardBg: string;
  titleColor: string;
  skillBg: string;
  techBg: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  [key: string]: string;
}

export const getDesignStyles = (profile: WebsiteData | null, theme: 'dark' | 'light' = 'dark'): Styles => {
  // Default dark theme styles
  const darkStyles: Styles = {
    headerBg: "bg-gradient-to-b from-brand-dark to-brand-darker",
    cardBg: "glass",
    titleColor: "text-brand-red",
    skillBg: "bg-brand-red/10 text-brand-red",
    techBg: "bg-white/5 text-gray-300",
    textColor: "text-white",
    subtextColor: "text-gray-300",
    borderColor: "border-white/10"
  };
  
  // Default light theme styles - improved for better contrast
  const lightStyles: Styles = {
    headerBg: "bg-gradient-to-b from-gray-50 to-gray-100",
    cardBg: "bg-white shadow-md border border-gray-200",
    titleColor: "text-brand-red",
    skillBg: "bg-brand-red/10 text-brand-red",
    techBg: "bg-gray-100 text-gray-700",
    textColor: "text-gray-900",
    subtextColor: "text-gray-600",
    borderColor: "border-gray-200"
  };

  // Get the base styles based on the current theme
  const baseStyles = theme === 'dark' ? darkStyles : lightStyles;
  
  // Safely check if profile and designStyle exist before using them
  if (profile && profile.designStyle) {
    switch(profile.designStyle) {
      case "minimalist":
        if (theme === 'dark') {
          baseStyles.headerBg = "bg-black";
          baseStyles.cardBg = "bg-zinc-900 border border-zinc-800";
          baseStyles.skillBg = "bg-zinc-800 text-white";
          baseStyles.techBg = "bg-zinc-800 text-white";
          baseStyles.titleColor = "text-white";
        } else {
          baseStyles.headerBg = "bg-white";
          baseStyles.cardBg = "bg-white shadow-sm border border-gray-100";
          baseStyles.skillBg = "bg-gray-100 text-gray-800";
          baseStyles.techBg = "bg-gray-100 text-gray-800";
          baseStyles.titleColor = "text-gray-900";
        }
        break;
      
      case "modern":
        if (theme === 'dark') {
          baseStyles.headerBg = "bg-gradient-to-r from-gray-900 to-gray-800";
          baseStyles.cardBg = "bg-gray-800/80 backdrop-blur-sm border border-gray-700";
          baseStyles.skillBg = "bg-gray-700 text-white";
          baseStyles.techBg = "bg-gray-700 text-white";
        } else {
          baseStyles.headerBg = "bg-gradient-to-r from-blue-50 to-indigo-50";
          baseStyles.cardBg = "bg-white shadow-md border border-blue-100";
          baseStyles.titleColor = "text-blue-800";
          baseStyles.skillBg = "bg-blue-100 text-blue-800";
          baseStyles.techBg = "bg-indigo-100 text-indigo-800";
        }
        break;
      
      case "professional":
        if (theme === 'dark') {
          baseStyles.headerBg = "bg-gradient-to-b from-blue-900 to-gray-900";
          baseStyles.cardBg = "bg-gray-800 border border-gray-700";
          baseStyles.titleColor = "text-blue-400";
          baseStyles.skillBg = "bg-blue-900/40 text-blue-400";
          baseStyles.techBg = "bg-gray-700 text-gray-300";
        } else {
          baseStyles.headerBg = "bg-gradient-to-b from-blue-100 to-gray-50";
          baseStyles.cardBg = "bg-white shadow-md border border-blue-200";
          baseStyles.titleColor = "text-blue-700";
          baseStyles.skillBg = "bg-blue-100 text-blue-700";
          baseStyles.techBg = "bg-gray-100 text-gray-700";
        }
        break;
      
      case "creative":
        if (theme === 'dark') {
          baseStyles.headerBg = "bg-gradient-to-r from-brand-red to-purple-500";
          baseStyles.cardBg = "bg-black/60 backdrop-blur-lg border border-purple-900/40";
          baseStyles.skillBg = "bg-white/20 text-white";
          baseStyles.techBg = "bg-purple-900/40 text-purple-200";
          baseStyles.titleColor = "text-gradient-white";
        } else {
          baseStyles.headerBg = "bg-gradient-to-r from-red-400 to-purple-400";
          baseStyles.cardBg = "bg-white/90 backdrop-blur-sm shadow-lg border border-purple-200";
          baseStyles.skillBg = "bg-purple-100 text-purple-800";
          baseStyles.techBg = "bg-red-100 text-red-800";
          baseStyles.titleColor = "text-purple-700";
        }
        break;
      
      case "tech":
        if (theme === 'dark') {
          baseStyles.headerBg = "bg-gradient-to-r from-black to-gray-900 bg-tech-pattern";
          baseStyles.cardBg = "bg-black/70 border border-gray-800";
          baseStyles.skillBg = "bg-green-900/30 text-green-400";
          baseStyles.techBg = "bg-gray-900 text-green-400";
          baseStyles.titleColor = "text-green-400";
          baseStyles.subtextColor = "text-green-600";
        } else {
          baseStyles.headerBg = "bg-gradient-to-r from-gray-100 to-gray-200 bg-tech-pattern";
          baseStyles.cardBg = "bg-white/90 border border-gray-300 shadow-md";
          baseStyles.skillBg = "bg-green-100 text-green-700";
          baseStyles.techBg = "bg-gray-100 text-gray-800";
          baseStyles.titleColor = "text-green-700";
          baseStyles.subtextColor = "text-gray-600";
        }
        break;
      
      case "elegant":
        if (theme === 'dark') {
          baseStyles.headerBg = "bg-gradient-to-b from-gray-800 to-gray-900";
          baseStyles.cardBg = "bg-gray-900/80 backdrop-blur-sm border border-gray-800";
          baseStyles.titleColor = "text-amber-300";
          baseStyles.skillBg = "bg-amber-900/30 text-amber-300";
          baseStyles.techBg = "bg-gray-800 text-amber-200";
        } else {
          baseStyles.headerBg = "bg-gradient-to-b from-amber-50 to-amber-100";
          baseStyles.cardBg = "bg-white shadow-md border border-amber-200";
          baseStyles.titleColor = "text-amber-800";
          baseStyles.skillBg = "bg-amber-100 text-amber-800";
          baseStyles.techBg = "bg-amber-50 text-amber-700";
        }
        break;
      // Add more style variations as needed
    }
  }
  
  return baseStyles;
};

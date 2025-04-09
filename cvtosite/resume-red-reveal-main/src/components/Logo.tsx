
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <img 
          src="/lovable-uploads/04a768e4-c052-45e1-85c8-d4c3d668d339.png" 
          alt="Adtechademy Logo" 
          className="h-10 w-auto relative z-10 animate-pulse-soft"
        />
        <div className="absolute inset-0 blur-md bg-brand-red/30 rounded-full animate-glow"></div>
      </div>
      <div className="ml-2 font-bold text-xl">
        <span className="text-gradient-white">adtech</span>
        <span className="text-gradient-red">ademy</span>
      </div>
    </div>
  );
};

export default Logo;

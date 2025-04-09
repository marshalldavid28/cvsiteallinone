
import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, FileText } from "lucide-react";

interface ViewToggleProps {
  currentView: "standard" | "two-column";
  onViewChange: (view: "standard" | "two-column") => void;
  theme: 'dark' | 'light';
}

const ViewToggle: React.FC<ViewToggleProps> = ({ 
  currentView, 
  onViewChange,
  theme
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant={currentView === "standard" ? "default" : "outline"}
        onClick={() => onViewChange("standard")}
        className={`flex items-center gap-2 ${
          theme === 'dark' && currentView !== "standard" 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : ''
        }`}
      >
        <Monitor size={16} />
        <span className="hidden sm:inline">Standard View</span>
      </Button>
      
      <Button
        size="sm"
        variant={currentView === "two-column" ? "default" : "outline"}
        onClick={() => onViewChange("two-column")}
        className={`flex items-center gap-2 ${
          theme === 'dark' && currentView !== "two-column" 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : ''
        }`}
      >
        <FileText size={16} />
        <span className="hidden sm:inline">CV View</span>
      </Button>
    </div>
  );
};

export default ViewToggle;

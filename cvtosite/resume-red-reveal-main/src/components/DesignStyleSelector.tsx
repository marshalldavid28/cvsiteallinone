
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface DesignStyle {
  id: string;
  name: string;
  description: string;
  darkPreviewClass: string;
  lightPreviewClass: string;
  textClass: string;
}

interface DesignStyleSelectorProps {
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
}

const DesignStyleSelector: React.FC<DesignStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  const designStyles: DesignStyle[] = [
    {
      id: "tech",
      name: "Minimalist and Elegant",
      description: "A sleek, modern design with clean lines and sophisticated typography",
      darkPreviewClass: "bg-black border border-green-900/40 bg-tech-pattern",
      lightPreviewClass: "bg-gray-100 border border-gray-200 bg-tech-pattern",
      textClass: "text-green-400 dark:text-green-700"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Choose Your Design Style</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available theme */}
        <div className="relative">
          {designStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                selectedStyle === style.id ? "ring-2 ring-brand-red ring-offset-2 ring-offset-black" : ""
              }`}
              onClick={() => onStyleSelect(style.id)}
            >
              <div className="flex h-20 overflow-hidden rounded-t-lg">
                <div
                  className={`h-full w-1/2 ${style.darkPreviewClass} flex items-center justify-center`}
                >
                  <span className="font-medium text-shadow">Aa</span>
                </div>
                <div
                  className={`h-full w-1/2 ${style.lightPreviewClass} flex items-center justify-center`}
                >
                  <span className="font-medium text-shadow">Aa</span>
                </div>
              </div>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-1">{style.name}</h4>
                <p className="text-sm text-gray-400">{style.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Coming soon card */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6 space-y-4 h-full min-h-[180px]">
          <Construction className="h-10 w-10 text-green-500" />
          <p className="text-white text-center text-lg font-medium">More beautiful themes coming soon!</p>
          <p className="text-gray-300 text-center text-sm">We're working on expanding our design options to help you create the perfect professional website.</p>
        </div>
      </div>
    </div>
  );
};

export default DesignStyleSelector;

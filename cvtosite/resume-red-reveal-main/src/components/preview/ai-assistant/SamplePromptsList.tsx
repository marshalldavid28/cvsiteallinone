
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { samplePrompts } from './sample-prompts';

interface SamplePromptsListProps {
  onPromptClick: (prompt: string) => void;
  theme: 'dark' | 'light';
}

const SamplePromptsList: React.FC<SamplePromptsListProps> = ({
  onPromptClick,
  theme
}) => {
  const [showSamplePrompts, setShowSamplePrompts] = useState(true);
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setShowSamplePrompts(!showSamplePrompts)}
      >
        <h4 className="text-sm font-medium">Sample prompts</h4>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {showSamplePrompts ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </Button>
      </div>
      
      {showSamplePrompts && (
        <div className={`space-y-2 mb-4 p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {samplePrompts.map((samplePrompt, index) => (
            <div 
              key={index}
              className={`text-xs p-2 rounded cursor-pointer hover:bg-opacity-80 ${
                theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
              }`}
              onClick={() => onPromptClick(samplePrompt)}
            >
              "{samplePrompt}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SamplePromptsList;

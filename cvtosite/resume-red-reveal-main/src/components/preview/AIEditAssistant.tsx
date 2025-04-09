
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { WebsiteData } from "@/types/website";
import SkillsExtractor from './ai-assistant/SkillsExtractor';
import SamplePromptsList from './ai-assistant/SamplePromptsList';
import PromptForm from './ai-assistant/PromptForm';

interface AIEditAssistantProps {
  profile: WebsiteData;
  onProfileUpdate: (updatedProfile: WebsiteData) => void;
  theme: 'dark' | 'light';
}

const AIEditAssistant: React.FC<AIEditAssistantProps> = ({
  profile,
  onProfileUpdate,
  theme
}) => {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSamplePromptClick = (promptText: string) => {
    setPrompt(promptText);
  };
  
  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-5 right-5 shadow-lg bg-[#FEF7CD] hover:bg-[#FEF7CD]/90 text-gray-800 z-40 px-8 py-4 text-base font-semibold rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        AI Assistant
      </Button>
    );
  }
  
  return (
    <div 
      className={`fixed bottom-5 right-5 w-80 sm:w-96 rounded-lg shadow-lg z-40 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className={`p-3 rounded-t-lg flex justify-between items-center ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <h3 className="font-medium">AI CV Assistant</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full" 
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <SkillsExtractor 
          profile={profile}
          onProfileUpdate={onProfileUpdate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        
        <SamplePromptsList 
          onPromptClick={handleSamplePromptClick}
          theme={theme}
        />
        
        <PromptForm 
          prompt={prompt}
          setPrompt={setPrompt}
          profile={profile}
          onProfileUpdate={onProfileUpdate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSuccess={() => setIsOpen(false)}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default AIEditAssistant;


import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProcessingStepProps {
  step: number;
  totalSteps: number;
  currentStep: string;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ 
  step, 
  totalSteps,
  currentStep 
}) => {
  const progress = (step / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto glass p-6 rounded-lg gradient-border transition-all duration-300 ease-in-out hover:shadow-card-hover dark:hover:shadow-card-hover-dark hover:-translate-y-1 hover:before:opacity-100 relative before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity before:duration-300 before:shadow-glow-red-light dark:before:shadow-glow-red">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gradient-white font-semibold">Processing CV</span>
        <span className="text-gradient-red font-mono">{Math.round(progress)}%</span>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-2 bg-secondary overflow-hidden" />
        <div 
          className="absolute top-0 h-2 opacity-30 blur-sm" 
          style={{ 
            width: `${progress}%`, 
            background: "linear-gradient(90deg, #FF4D61, #FF6B81)",
          }}
        ></div>
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse-soft font-mono tracking-wide">
        <span className="text-brand-red mr-2">{">"}</span>
        {currentStep}
      </p>
    </div>
  );
};

export default ProcessingStep;

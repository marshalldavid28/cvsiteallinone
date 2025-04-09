
import React from "react";
import ProcessingStep from "@/components/ProcessingStep";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProcessingViewProps {
  step: number;
  totalSteps: number;
  currentStep: string;
  error: string | null;
  onReset: () => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({
  step,
  totalSteps,
  currentStep,
  error,
  onReset
}) => {
  return (
    <div className="glass p-10 rounded-xl">
      <ProcessingStep 
        step={step} 
        totalSteps={totalSteps} 
        currentStep={currentStep}
      />
      
      {error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-md text-center relative">
          <button 
            className="absolute top-2 right-2 text-red-300 hover:text-red-100 transition-colors"
            onClick={onReset}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
          <p className="text-red-300 mb-3 pr-6">{error}</p>
          <Button 
            variant="outline"
            onClick={onReset}
            className="border-red-500/50 text-red-300 hover:bg-red-500/20"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProcessingView;

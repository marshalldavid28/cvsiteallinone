
import { useState } from "react";

export interface ProcessingState {
  isProcessing: boolean;
  processingStep: number;
  currentStepText: string;
  processingError: string | null;
}

export function useProcessingState() {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    processingStep: 1,
    currentStepText: "Uploading CV...",
    processingError: null
  });
  
  const totalSteps = 5;
  
  const updateProcessingState = (updates: Partial<ProcessingState>) => {
    setProcessingState(prev => ({ ...prev, ...updates }));
  };
  
  const handleReset = () => {
    updateProcessingState({
      isProcessing: false,
      processingError: null,
      processingStep: 1
    });
  };

  return {
    processingState,
    updateProcessingState,
    handleReset,
    totalSteps
  };
}

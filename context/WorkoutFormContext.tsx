import type React from 'react';
import { createContext, type ReactNode, useContext, useState } from 'react';

type WorkoutFormontextType = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isGeneratedByIA: boolean | undefined;
  setIsGeneratedByIA: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  nextStep: VoidFunction;
  prevStep: VoidFunction;
  goToStep: (step: number) => void;
};

const WorkoutFormContext = createContext<WorkoutFormontextType | undefined>(
  undefined
);

export const WorkoutFormProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [isGeneratedByIA, setIsGeneratedByIA] = useState<boolean>();

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, 5));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function goToStep(stepNumber: number) {
    if (stepNumber >= 1 && stepNumber <= 5) {
      setStep(stepNumber);
    }
  }

  return (
    <WorkoutFormContext.Provider
      value={{
        step,
        setStep,
        nextStep,
        prevStep,
        goToStep,
        isGeneratedByIA,
        setIsGeneratedByIA,
      }}
    >
      {children}
    </WorkoutFormContext.Provider>
  );
};

export const useWorkoutForm = () => {
  const context = useContext(WorkoutFormContext);
  if (!context) {
    throw new Error('useWorkoutForm must be used within a WorkoutFormProvider');
  }
  return context;
};

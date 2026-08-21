'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ResumeData, TemplateName, BuilderStep, EMPTY_RESUME } from '@/types/resume';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
  selectedTemplate: TemplateName;
  setSelectedTemplate: (template: TemplateName) => void;
  currentStep: BuilderStep;
  setCurrentStep: (step: BuilderStep) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  processingMessage: string;
  setProcessingMessage: (message: string) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>('modern');
  const [currentStep, setCurrentStep] = useState<BuilderStep>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const updateField = useCallback(<K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetResume = useCallback(() => {
    setResumeData(EMPTY_RESUME);
    setSelectedTemplate('modern');
    setCurrentStep('upload');
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updateField,
        selectedTemplate,
        setSelectedTemplate,
        currentStep,
        setCurrentStep,
        isProcessing,
        setIsProcessing,
        processingMessage,
        setProcessingMessage,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

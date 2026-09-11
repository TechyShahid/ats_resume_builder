'use client';

import { HiCloudArrowUp, HiPencilSquare, HiSwatch, HiArrowDownTray, HiArrowLeft, HiArrowRight, HiSparkles } from 'react-icons/hi2';
import { ResumeProvider, useResume } from '@/context/ResumeContext';
import ResumeUploader from '@/components/builder/ResumeUploader';
import ResumeForm from '@/components/builder/ResumeForm';
import TemplateSelector from '@/components/builder/TemplateSelector';
import ResumePreview from '@/components/builder/ResumePreview';
import ResumeStylingStrip from '@/components/builder/ResumeStylingStrip';
import Link from 'next/link';
import type { BuilderStep } from '@/types/resume';
import styles from './builder.module.css';

const STEPS: { id: BuilderStep; label: string; icon: React.ReactNode }[] = [
  { id: 'upload', label: 'Upload', icon: <HiCloudArrowUp /> },
  { id: 'edit', label: 'Edit', icon: <HiPencilSquare /> },
  { id: 'template', label: 'Template', icon: <HiSwatch /> },
  { id: 'download', label: 'Download', icon: <HiArrowDownTray /> },
];

function BuilderContent() {
  const {
    currentStep,
    setCurrentStep,
    isProcessing,
    processingMessage,
  } = useResume();

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const goNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return <ResumeUploader />;
      case 'edit':
        return <ResumeForm />;
      case 'template':
        return <TemplateSelector />;
      case 'download':
        return (
          <div className={styles.downloadStep}>
            <HiArrowDownTray className={styles.downloadIcon} />
            <h3>Your resume is ready!</h3>
            <p>Use the preview panel to download your ATS-optimized resume as a PDF.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.builder}>
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="spinner spinner-lg" />
          <p>{processingMessage || 'Processing...'}</p>
        </div>
      )}

      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          <div className={styles.logoIcon}><HiSparkles /></div>
          <span className={styles.logoText}>ResumeAI</span>
        </Link>

        {/* Step Indicators */}
        <div className={styles.steps}>
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              className={`${styles.step} ${currentStep === step.id ? styles.stepActive : ''} ${index < currentStepIndex ? styles.stepDone : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <span className={styles.stepIcon}>{step.icon}</span>
              <span className={styles.stepLabel}>{step.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.topBarActions}>
          {currentStepIndex > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={goPrev}>
              <HiArrowLeft /> Back
            </button>
          )}
          {currentStepIndex < STEPS.length - 1 && currentStep !== 'upload' && (
            <button className="btn btn-primary btn-sm" onClick={goNext}>
              Next <HiArrowRight />
            </button>
          )}
        </div>
      </div>

      {/* Common Horizontal Resume Styling Strip Below Main Menu */}
      <ResumeStylingStrip />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Panel - Editor */}
        <div className={styles.editorPanel}>
          <div className={styles.editorScroll}>
            {renderStepContent()}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className={styles.previewPanel}>
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <ResumeProvider>
      <BuilderContent />
    </ResumeProvider>
  );
}

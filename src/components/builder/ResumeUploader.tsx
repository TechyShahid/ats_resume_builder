'use client';

import { useCallback, useState } from 'react';
import { HiCloudArrowUp, HiDocumentText, HiXMark } from 'react-icons/hi2';
import { useResume } from '@/context/ResumeContext';
import { validateFile } from '@/lib/validators';
import type { ResumeData } from '@/types/resume';
import styles from './ResumeUploader.module.css';

export default function ResumeUploader() {
  const { setResumeData, setCurrentStep, setIsProcessing, setProcessingMessage } = useResume();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = useCallback(async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    setFileName(file.name);
    setIsProcessing(true);
    setProcessingMessage('Extracting text from your resume...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProcessingMessage('AI is analyzing your resume...');

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const result = await response.json();
      setResumeData(result.data as ResumeData);
      setProcessingMessage('Resume parsed successfully!');

      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('edit');
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      setError(err instanceof Error ? err.message : 'Failed to process resume');
    }
  }, [setResumeData, setCurrentStep, setIsProcessing, setProcessingMessage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleSkip = () => {
    setCurrentStep('edit');
  };

  return (
    <div className={styles.uploader}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upload Your Resume</h2>
        <p className={styles.subtitle}>
          Upload your existing resume and let AI parse and optimize it automatically.
        </p>
      </div>

      <div
        className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInput}
          className={styles.fileInput}
        />

        <div className={styles.dropzoneContent}>
          <div className={styles.uploadIcon}>
            <HiCloudArrowUp />
          </div>

          {fileName ? (
            <div className={styles.fileInfo}>
              <HiDocumentText />
              <span>{fileName}</span>
              <button onClick={() => setFileName('')} className={styles.removeFile}>
                <HiXMark />
              </button>
            </div>
          ) : (
            <>
              <p className={styles.dropText}>
                Drag & drop your resume here, or{' '}
                <label htmlFor="resume-upload" className={styles.browseLink}>
                  browse files
                </label>
              </p>
              <p className={styles.fileTypes}>Supports PDF and DOCX files up to 10MB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <HiXMark /> {error}
        </div>
      )}

      <div className={styles.dividerRow}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>OR</span>
        <div className={styles.dividerLine} />
      </div>

      <button onClick={handleSkip} className={`btn btn-secondary ${styles.skipBtn}`}>
        Start from Scratch
      </button>
    </div>
  );
}

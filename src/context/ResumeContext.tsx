'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  ResumeData,
  TemplateName,
  BuilderStep,
  EMPTY_RESUME,
  ResumeFontFamily,
  ResumeFontSize,
  ResumeFieldStyles,
  FieldCustomization,
  DEFAULT_FIELD_STYLES,
} from '@/types/resume';

export interface ActiveSelectionInfo {
  text: string;
  fieldLabel?: string;
  fieldPath?: string;
  element?: HTMLInputElement | HTMLTextAreaElement | null;
  start?: number;
  end?: number;
}

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
  selectedTemplate: TemplateName;
  setSelectedTemplate: (template: TemplateName) => void;
  selectedFont: ResumeFontFamily;
  setSelectedFont: (font: ResumeFontFamily) => void;
  selectedFontSize: ResumeFontSize;
  setSelectedFontSize: (size: ResumeFontSize) => void;
  fieldStyles: ResumeFieldStyles;
  setFieldStyles: React.Dispatch<React.SetStateAction<ResumeFieldStyles>>;
  updateFieldStyle: (
    field: keyof Omit<ResumeFieldStyles, 'accentColor'>,
    key: keyof FieldCustomization,
    value: unknown
  ) => void;
  setAccentColor: (color: string) => void;
  resetFieldStyles: () => void;
  activeSelection: ActiveSelectionInfo | null;
  setActiveSelection: React.Dispatch<React.SetStateAction<ActiveSelectionInfo | null>>;
  applyFormatToSelection: (
    type: 'bold' | 'italic' | 'color' | 'size' | 'link' | 'clear' | 'edit_text',
    arg?: string | number
  ) => void;
  currentStep: BuilderStep;
  setCurrentStep: (step: BuilderStep) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  processingMessage: string;
  setProcessingMessage: (message: string) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

function replaceTextInResumeData(data: ResumeData, target: string, replacement: string): ResumeData {
  if (!target || !replacement || target === replacement) return data;

  const replaceString = (str?: string | null): string => {
    if (!str || !str.includes(target)) return str || '';
    return str.replace(target, replacement);
  };

  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      fullName: replaceString(data.personalInfo.fullName),
      title: replaceString(data.personalInfo.title),
      email: replaceString(data.personalInfo.email),
      phone: replaceString(data.personalInfo.phone),
      location: replaceString(data.personalInfo.location),
      linkedin: replaceString(data.personalInfo.linkedin),
      portfolio: replaceString(data.personalInfo.portfolio),
    },
    summary: replaceString(data.summary),
    experience: data.experience.map((exp) => ({
      ...exp,
      position: replaceString(exp.position),
      company: replaceString(exp.company),
      location: replaceString(exp.location),
      bullets: exp.bullets.map((b) => replaceString(b)),
    })),
    education: data.education.map((edu) => ({
      ...edu,
      degree: replaceString(edu.degree),
      field: replaceString(edu.field),
      institution: replaceString(edu.institution),
      location: replaceString(edu.location),
    })),
    skills: data.skills.map((sk) => ({
      ...sk,
      name: replaceString(sk.name),
    })),
    projects: data.projects.map((proj) => ({
      ...proj,
      name: replaceString(proj.name),
      description: replaceString(proj.description),
      techStack: (proj.techStack || []).map((t) => replaceString(t)),
      bullets: (proj.bullets || []).map((b) => replaceString(b)),
    })),
    certifications: data.certifications.map((cert) => ({
      ...cert,
      name: replaceString(cert.name),
      issuer: replaceString(cert.issuer),
    })),
  };
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>('modern');
  const [selectedFont, setSelectedFont] = useState<ResumeFontFamily>('default');
  const [selectedFontSize, setSelectedFontSize] = useState<ResumeFontSize>('standard');
  const [fieldStyles, setFieldStyles] = useState<ResumeFieldStyles>(DEFAULT_FIELD_STYLES);
  const [currentStep, setCurrentStep] = useState<BuilderStep>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [activeSelection, setActiveSelection] = useState<ActiveSelectionInfo | null>(null);

  const updateField = useCallback(<K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateFieldStyle = useCallback(
    (field: keyof Omit<ResumeFieldStyles, 'accentColor'>, key: keyof FieldCustomization, value: unknown) => {
      setFieldStyles((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [key]: value,
        },
      }));
    },
    []
  );

  const setAccentColor = useCallback((color: string) => {
    setFieldStyles((prev) => ({
      ...prev,
      accentColor: color,
    }));
  }, []);

  const resetFieldStyles = useCallback(() => {
    setFieldStyles(DEFAULT_FIELD_STYLES);
  }, []);

  // Helper: strip all formatting tags from a string (loops for nested tags)
  const stripAllFormatting = useCallback((text: string): string => {
    let prev = '';
    let result = text;
    // Loop until stable — handles nested [color=...][size=...]...[/size][/color]
    while (result !== prev) {
      prev = result;
      result = result
        .replace(/\[color=[^\]]+\](.*?)\[\/color\]/gi, '$1')
        .replace(/\[size=[^\]]+\](.*?)\[\/size\]/gi, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/gi, '$1')
        .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1');
    }
    return result;
  }, []);

  // Helper: apply formatting to a text snippet
  const applyFormatting = useCallback(
    (selected: string, type: string, arg?: string | number): string => {
      if (type === 'bold') {
        if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
          return selected.slice(2, -2);
        }
        return `**${selected}**`;
      } else if (type === 'italic') {
        // Avoid toggling bold markers when trying italic
        if (
          selected.startsWith('*') &&
          selected.endsWith('*') &&
          !selected.startsWith('**') &&
          selected.length >= 2
        ) {
          return selected.slice(1, -1);
        }
        return `*${selected}*`;
      } else if (type === 'color') {
        const hex = String(arg || '#2563eb');
        const cleaned = stripAllFormatting(selected);
        return `[color=${hex}]${cleaned}[/color]`;
      } else if (type === 'size') {
        const sizeDelta = String(arg ?? '+1');
        const cleaned = selected.replace(/\[size=[^\]]+\]([\s\S]*?)\[\/size\]/gi, '$1');
        return `[size=${sizeDelta}]${cleaned}[/size]`;
      } else if (type === 'link') {
        const url = String(arg || 'https://');
        const cleaned = selected.replace(/\[([^\]]+)\]\([^)]+\)/gi, '$1');
        return `[${cleaned}](${url})`;
      } else if (type === 'clear') {
        return stripAllFormatting(selected);
      } else if (type === 'edit_text' && arg !== undefined) {
        return String(arg);
      }
      return selected;
    },
    [stripAllFormatting]
  );

  // Helper: read the value of a field at a given path from resumeData
  const getFieldValue = useCallback(
    (fieldPath: string, data: ResumeData): string | null => {
      if (fieldPath === 'personalInfo.fullName') return data.personalInfo.fullName;
      if (fieldPath === 'personalInfo.title') return data.personalInfo.title;
      if (fieldPath === 'personalInfo.email') return data.personalInfo.email;
      if (fieldPath === 'personalInfo.phone') return data.personalInfo.phone;
      if (fieldPath === 'personalInfo.location') return data.personalInfo.location;
      if (fieldPath === 'personalInfo.linkedin') return data.personalInfo.linkedin || '';
      if (fieldPath === 'personalInfo.portfolio') return data.personalInfo.portfolio || '';
      if (fieldPath === 'summary') return data.summary;
      // experience.0.position, experience.0.company, experience.0.location, experience.0.bullets.0
      const expMatch = fieldPath.match(/^experience\.(\d+)\.(\w+)(?:\.(\d+))?$/);
      if (expMatch) {
        const idx = parseInt(expMatch[1], 10);
        const key = expMatch[2];
        const subIdx = expMatch[3] !== undefined ? parseInt(expMatch[3], 10) : undefined;
        const exp = data.experience[idx];
        if (!exp) return null;
        if (key === 'bullets' && subIdx !== undefined) return exp.bullets[subIdx] ?? null;
        return (exp as unknown as Record<string, unknown>)[key] as string ?? null;
      }
      // education.0.degree etc.
      const eduMatch = fieldPath.match(/^education\.(\d+)\.(\w+)$/);
      if (eduMatch) {
        const idx = parseInt(eduMatch[1], 10);
        const key = eduMatch[2];
        const edu = data.education[idx];
        if (!edu) return null;
        return (edu as unknown as Record<string, unknown>)[key] as string ?? null;
      }
      // projects.0.name etc.
      const projMatch = fieldPath.match(/^projects\.(\d+)\.(\w+)(?:\.(\d+))?$/);
      if (projMatch) {
        const idx = parseInt(projMatch[1], 10);
        const key = projMatch[2];
        const subIdx = projMatch[3] !== undefined ? parseInt(projMatch[3], 10) : undefined;
        const proj = data.projects[idx];
        if (!proj) return null;
        if (key === 'bullets' && subIdx !== undefined) return (proj.bullets || [])[subIdx] ?? null;
        if (key === 'techStack' && subIdx !== undefined) return (proj.techStack || [])[subIdx] ?? null;
        return (proj as unknown as Record<string, unknown>)[key] as string ?? null;
      }
      // certifications.0.name etc.
      const certMatch = fieldPath.match(/^certifications\.(\d+)\.(\w+)$/);
      if (certMatch) {
        const idx = parseInt(certMatch[1], 10);
        const key = certMatch[2];
        const cert = data.certifications[idx];
        if (!cert) return null;
        return (cert as unknown as Record<string, unknown>)[key] as string ?? null;
      }
      return null;
    },
    []
  );

  // Helper: set the value of a field at a given path in resumeData
  const setFieldValue = useCallback(
    (fieldPath: string, newValue: string, data: ResumeData): ResumeData => {
      if (fieldPath === 'personalInfo.fullName') {
        return { ...data, personalInfo: { ...data.personalInfo, fullName: newValue } };
      }
      if (fieldPath === 'personalInfo.title') {
        return { ...data, personalInfo: { ...data.personalInfo, title: newValue } };
      }
      if (fieldPath === 'personalInfo.email') {
        return { ...data, personalInfo: { ...data.personalInfo, email: newValue } };
      }
      if (fieldPath === 'personalInfo.phone') {
        return { ...data, personalInfo: { ...data.personalInfo, phone: newValue } };
      }
      if (fieldPath === 'personalInfo.location') {
        return { ...data, personalInfo: { ...data.personalInfo, location: newValue } };
      }
      if (fieldPath === 'personalInfo.linkedin') {
        return { ...data, personalInfo: { ...data.personalInfo, linkedin: newValue } };
      }
      if (fieldPath === 'personalInfo.portfolio') {
        return { ...data, personalInfo: { ...data.personalInfo, portfolio: newValue } };
      }
      if (fieldPath === 'summary') {
        return { ...data, summary: newValue };
      }
      const expMatch = fieldPath.match(/^experience\.(\d+)\.(\w+)(?:\.(\d+))?$/);
      if (expMatch) {
        const idx = parseInt(expMatch[1], 10);
        const key = expMatch[2];
        const subIdx = expMatch[3] !== undefined ? parseInt(expMatch[3], 10) : undefined;
        const experience = [...data.experience];
        if (!experience[idx]) return data;
        if (key === 'bullets' && subIdx !== undefined) {
          const bullets = [...experience[idx].bullets];
          bullets[subIdx] = newValue;
          experience[idx] = { ...experience[idx], bullets };
        } else {
          experience[idx] = { ...experience[idx], [key]: newValue };
        }
        return { ...data, experience };
      }
      const eduMatch = fieldPath.match(/^education\.(\d+)\.(\w+)$/);
      if (eduMatch) {
        const idx = parseInt(eduMatch[1], 10);
        const key = eduMatch[2];
        const education = [...data.education];
        if (!education[idx]) return data;
        education[idx] = { ...education[idx], [key]: newValue };
        return { ...data, education };
      }
      const projMatch = fieldPath.match(/^projects\.(\d+)\.(\w+)(?:\.(\d+))?$/);
      if (projMatch) {
        const idx = parseInt(projMatch[1], 10);
        const key = projMatch[2];
        const subIdx = projMatch[3] !== undefined ? parseInt(projMatch[3], 10) : undefined;
        const projects = [...data.projects];
        if (!projects[idx]) return data;
        if (key === 'bullets' && subIdx !== undefined) {
          const bullets = [...(projects[idx].bullets || [])];
          bullets[subIdx] = newValue;
          projects[idx] = { ...projects[idx], bullets };
        } else if (key === 'techStack' && subIdx !== undefined) {
          const techStack = [...(projects[idx].techStack || [])];
          techStack[subIdx] = newValue;
          projects[idx] = { ...projects[idx], techStack };
        } else {
          projects[idx] = { ...projects[idx], [key]: newValue };
        }
        return { ...data, projects };
      }
      const certMatch = fieldPath.match(/^certifications\.(\d+)\.(\w+)$/);
      if (certMatch) {
        const idx = parseInt(certMatch[1], 10);
        const key = certMatch[2];
        const certifications = [...data.certifications];
        if (!certifications[idx]) return data;
        certifications[idx] = { ...certifications[idx], [key]: newValue };
        return { ...data, certifications };
      }
      return data;
    },
    []
  );

  // Universal word/field formatting logic
  const applyFormatToSelection = useCallback(
    (
      type: 'bold' | 'italic' | 'color' | 'size' | 'link' | 'clear' | 'edit_text',
      arg?: string | number
    ) => {
      const sel = activeSelection;
      if (!sel) return;

      const el = sel.element;
      const fieldPath = sel.fieldPath || el?.getAttribute('data-field-path') || '';

      // Strategy A: We have a tracked input/textarea element still in the DOM
      if (el && typeof document !== 'undefined' && document.body.contains(el)) {
        const fullVal = el.value || '';
        // Use the stored selection range, or fall back to the live cursor position
        let start = sel.start ?? el.selectionStart ?? 0;
        let end = sel.end ?? el.selectionEnd ?? 0;

        // If cursor is placed but no text highlighted, format entire input value
        if (start === end) {
          if (fullVal.trim().length > 0) {
            start = 0;
            end = fullVal.length;
          } else {
            return;
          }
        }

        const selected = fullVal.substring(start, end);
        const replacement = applyFormatting(selected, type, arg);
        const updatedVal = fullVal.substring(0, start) + replacement + fullVal.substring(end);

        // Directly update resumeData via fieldPath if available
        if (fieldPath) {
          setResumeData((prev) => setFieldValue(fieldPath, updatedVal, prev));
        } else {
          // Fallback: use nativeSetter for inputs without data-field-path
          const proto =
            el instanceof HTMLTextAreaElement
              ? window.HTMLTextAreaElement.prototype
              : window.HTMLInputElement.prototype;
          const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (nativeSetter) {
            nativeSetter.call(el, updatedVal);
          } else {
            el.value = updatedVal;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Restore focus and selection
        const newCursorEnd = start + replacement.length;
        setTimeout(() => {
          try {
            el.focus();
            el.setSelectionRange(start, newCursorEnd);
          } catch { /* ignore for non-text inputs */ }
        }, 10);

        setActiveSelection((prev) =>
          prev
            ? { ...prev, text: replacement, start, end: newCursorEnd }
            : null
        );
        return;
      }

      // Strategy B: If we have a field path but no active element (e.g. dropdown selection)
      if (fieldPath) {
        setResumeData((prev) => {
          const currentVal = getFieldValue(fieldPath, prev);
          if (currentVal === null) return prev;
          const replacement = applyFormatting(currentVal, type, arg);
          return setFieldValue(fieldPath, replacement, prev);
        });
        setActiveSelection((prev) =>
          prev ? { ...prev, text: applyFormatting(prev.text, type, arg) } : null
        );
        return;
      }

      // Strategy C: Text was highlighted on the resume preview or elsewhere
      const targetText =
        sel.text ||
        (typeof window !== 'undefined' ? window.getSelection()?.toString().trim() : '');

      if (targetText) {
        const replacement = applyFormatting(targetText, type, arg);
        setResumeData((prev) => replaceTextInResumeData(prev, targetText, replacement));
        setActiveSelection({ text: replacement, fieldLabel: 'Resume Selection' });
      }
    },
    [activeSelection, setResumeData, applyFormatting, getFieldValue, setFieldValue]
  );

  // Ref to track if toolbar is being clicked (to avoid clearing selection)
  const isToolbarClickRef = React.useRef(false);

  // Global listener for text selection across page and inputs
  React.useEffect(() => {
    const handleSelection = () => {
      // Skip if a toolbar button is being pressed
      if (isToolbarClickRef.current) return;

      const activeEl = document.activeElement;

      // Skip if focus is on a toolbar button/select inside the styling strip
      if (activeEl && activeEl.closest('[data-styling-strip]')) return;

      if (
        activeEl &&
        (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement)
      ) {
        const start = activeEl.selectionStart ?? 0;
        const end = activeEl.selectionEnd ?? 0;
        const val = activeEl.value || '';
        const selText = val.substring(start, end);
        const fieldPath = activeEl.getAttribute('data-field-path') || '';
        const label =
          activeEl.getAttribute('data-field-label') ||
          activeEl.getAttribute('placeholder') ||
          activeEl.getAttribute('name') ||
          'Form Field';
        setActiveSelection({
          text: selText || val,
          element: activeEl,
          start,
          end,
          fieldPath,
          fieldLabel: label,
        });
        return;
      }

      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (text) {
        setActiveSelection({
          text,
          fieldLabel: 'Preview Selection',
        });
      }
    };

    // Mark toolbar interactions to prevent selection clearing
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-styling-strip]')) {
        isToolbarClickRef.current = true;
        // Reset after a brief delay
        setTimeout(() => {
          isToolbarClickRef.current = false;
        }, 100);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('mousedown', handleMouseDown, true);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, []);

  const resetResume = useCallback(() => {
    setResumeData(EMPTY_RESUME);
    setSelectedTemplate('modern');
    setSelectedFont('default');
    setSelectedFontSize('standard');
    setFieldStyles(DEFAULT_FIELD_STYLES);
    setActiveSelection(null);
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
        selectedFont,
        setSelectedFont,
        selectedFontSize,
        setSelectedFontSize,
        fieldStyles,
        setFieldStyles,
        updateFieldStyle,
        setAccentColor,
        resetFieldStyles,
        activeSelection,
        setActiveSelection,
        applyFormatToSelection,
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

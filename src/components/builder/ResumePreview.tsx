'use client';

import { useRef, useState, useCallback } from 'react';
import {
  HiArrowDownTray,
  HiMagnifyingGlassMinus,
  HiMagnifyingGlassPlus,
  HiPrinter,
} from 'react-icons/hi2';
import { useResume } from '@/context/ResumeContext';
import ClassicTemplate from '@/templates/ClassicTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import TechTemplate from '@/templates/TechTemplate';
import NordicTemplate from '@/templates/NordicTemplate';
import CompactTemplate from '@/templates/CompactTemplate';
import ElegantTemplate from '@/templates/ElegantTemplate';
import {
  RESUME_FONTS,
  RESUME_FONT_SIZES,
} from '@/types/resume';
import styles from './ResumePreview.module.css';

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
  nordic: NordicTemplate,
  compact: CompactTemplate,
  elegant: ElegantTemplate,
};

export default function ResumePreview() {
  const {
    resumeData,
    selectedTemplate,
    selectedFont,
    selectedFontSize,
    fieldStyles,
  } = useResume();
  const [zoom, setZoom] = useState(0.55);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const TemplateComponent = TEMPLATES[selectedTemplate];
  const activeFont = RESUME_FONTS.find((f) => f.id === selectedFont) || RESUME_FONTS[0];
  const activeSize = RESUME_FONT_SIZES.find((s) => s.id === selectedFontSize) || RESUME_FONT_SIZES[1];

  const getFieldStyleVars = useCallback((): Record<string, string> => {
    const vars: Record<string, string> = {};

    // Name
    if (fieldStyles.name?.size) vars['--resume-name-size-delta'] = `${fieldStyles.name.size}pt`;
    if (fieldStyles.name?.bold !== undefined) vars['--resume-name-weight'] = fieldStyles.name.bold ? '700' : '400';
    if (fieldStyles.name?.italic !== undefined) vars['--resume-name-style'] = fieldStyles.name.italic ? 'italic' : 'normal';
    if (fieldStyles.name?.color) vars['--resume-name-color'] = fieldStyles.name.color;

    // Title
    if (fieldStyles.title?.size) vars['--resume-title-size-delta'] = `${fieldStyles.title.size}pt`;
    if (fieldStyles.title?.bold !== undefined) vars['--resume-title-weight'] = fieldStyles.title.bold ? '700' : '400';
    if (fieldStyles.title?.italic !== undefined) vars['--resume-title-style'] = fieldStyles.title.italic ? 'italic' : 'normal';
    if (fieldStyles.title?.color) vars['--resume-title-color'] = fieldStyles.title.color;

    // Section Title
    if (fieldStyles.sectionTitle?.size) vars['--resume-section-title-size-delta'] = `${fieldStyles.sectionTitle.size}pt`;
    if (fieldStyles.sectionTitle?.bold !== undefined) vars['--resume-section-title-weight'] = fieldStyles.sectionTitle.bold ? '700' : '400';
    if (fieldStyles.sectionTitle?.italic !== undefined) vars['--resume-section-title-style'] = fieldStyles.sectionTitle.italic ? 'italic' : 'normal';
    if (fieldStyles.sectionTitle?.color) vars['--resume-section-title-color'] = fieldStyles.sectionTitle.color;

    // Entry Title
    if (fieldStyles.entryTitle?.size) vars['--resume-entry-title-size-delta'] = `${fieldStyles.entryTitle.size}pt`;
    if (fieldStyles.entryTitle?.bold !== undefined) vars['--resume-entry-title-weight'] = fieldStyles.entryTitle.bold ? '700' : '400';
    if (fieldStyles.entryTitle?.italic !== undefined) vars['--resume-entry-title-style'] = fieldStyles.entryTitle.italic ? 'italic' : 'normal';
    if (fieldStyles.entryTitle?.color) vars['--resume-entry-title-color'] = fieldStyles.entryTitle.color;

    // Body Text
    if (fieldStyles.bodyText?.size) vars['--resume-body-size-delta'] = `${fieldStyles.bodyText.size}pt`;
    if (fieldStyles.bodyText?.bold !== undefined) vars['--resume-body-weight'] = fieldStyles.bodyText.bold ? '700' : '400';
    if (fieldStyles.bodyText?.italic !== undefined) vars['--resume-body-style'] = fieldStyles.bodyText.italic ? 'italic' : 'normal';
    if (fieldStyles.bodyText?.color) vars['--resume-body-color'] = fieldStyles.bodyText.color;

    // Accent Color
    if (fieldStyles.accentColor) vars['--resume-accent-color'] = fieldStyles.accentColor;

    return vars;
  }, [fieldStyles]);

  // Print-based PDF generation (most reliable fallback)
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Use html2canvas onclone to fix styling in the internal clone
      // This avoids modifying the live DOM and preserves all CSS module styles
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
          // Reset any transforms on parent elements in the clone
          let parent = clonedElement.parentElement;
          while (parent) {
            parent.style.transform = 'none';
            parent.style.overflow = 'visible';
            parent.style.position = 'static';
            parent.style.display = 'block';
            parent.style.height = 'auto';
            parent.style.width = 'auto';
            parent = parent.parentElement;
          }
          // Ensure the resume element itself renders at full A4 size
          clonedElement.style.width = '816px';
          clonedElement.style.height = '1056px';
          clonedElement.style.overflow = 'hidden';
          clonedElement.style.position = 'relative';
          clonedElement.style.transform = 'none';
          if (activeFont.fontFamily !== 'inherit') {
            clonedElement.style.setProperty('--resume-font', activeFont.fontFamily);
            clonedElement.style.fontFamily = activeFont.fontFamily;
          }
          clonedElement.style.setProperty('--resume-font-size', activeSize.sizePt);

          const fieldVars = getFieldStyleVars();
          Object.entries(fieldVars).forEach(([prop, val]) => {
            clonedElement.style.setProperty(prop, val);
          });
        },
      });

      // Generate single-page A4 PDF optimized to be well under 2MB
      const imgData = canvas.toDataURL('image/jpeg', 0.88);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = (resumeData.personalInfo.fullName || 'resume')
        .replace(/\s+/g, '_')
        .toLowerCase();
      pdf.save(`${fileName}_resume.pdf`);
    } catch (err) {
      console.error('PDF download failed:', err);
      // Fallback to print
      handlePrint();
    } finally {
      setDownloading(false);
    }
  }, [resumeData.personalInfo.fullName, activeFont.fontFamily, activeSize.sizePt, getFieldStyleVars, handlePrint]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.toolbar}>
        <div className={styles.zoomControls}>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
            title="Zoom out"
          >
            <HiMagnifyingGlassMinus />
          </button>
          <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setZoom((z) => Math.min(1, z + 0.1))}
            title="Zoom in"
          >
            <HiMagnifyingGlassPlus />
          </button>
        </div>

        <div className={styles.downloadActions}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handlePrint}
            title="Print / Save as PDF via browser"
          >
            <HiPrinter /> Print
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <><span className="spinner" /> Generating...</>
            ) : (
              <><HiArrowDownTray /> Download PDF</>
            )}
          </button>
        </div>
      </div>

      <div className={styles.previewScroll}>
        <div
          className={styles.page}
          style={{ transform: `scale(${zoom})` }}
        >
          <div
            ref={previewRef}
            className={styles.pageInner}
            id="resume-preview"
            style={
              {
                '--resume-font': activeFont.fontFamily,
                '--resume-font-size': activeSize.sizePt,
                fontFamily: activeFont.fontFamily !== 'inherit' ? activeFont.fontFamily : undefined,
                ...getFieldStyleVars(),
              } as React.CSSProperties
            }
          >
            <TemplateComponent data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

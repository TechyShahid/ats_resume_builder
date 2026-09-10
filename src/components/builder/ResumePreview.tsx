'use client';

import { useRef, useState, useCallback } from 'react';
import { HiArrowDownTray, HiMagnifyingGlassMinus, HiMagnifyingGlassPlus, HiPrinter } from 'react-icons/hi2';
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
  type ResumeFontFamily,
  type ResumeFontSize,
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
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
  } = useResume();
  const [zoom, setZoom] = useState(0.55);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const TemplateComponent = TEMPLATES[selectedTemplate];
  const activeFont = RESUME_FONTS.find((f) => f.id === selectedFont) || RESUME_FONTS[0];
  const activeSize = RESUME_FONT_SIZES.find((s) => s.id === selectedFontSize) || RESUME_FONT_SIZES[1];

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
  }, [resumeData.personalInfo.fullName, activeFont.fontFamily, activeSize.sizePt, handlePrint]);

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

        {/* Typography Controls */}
        <div className={styles.typographyControls}>
          <div className={styles.selectWrapper}>
            <label htmlFor="resume-font-select" className={styles.ctrlLabel}>
              Font
            </label>
            <select
              id="resume-font-select"
              className={styles.select}
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value as ResumeFontFamily)}
              title="Select Resume Font Family"
            >
              {RESUME_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <label htmlFor="resume-size-select" className={styles.ctrlLabel}>
              Size
            </label>
            <select
              id="resume-size-select"
              className={styles.select}
              value={selectedFontSize}
              onChange={(e) => setSelectedFontSize(e.target.value as ResumeFontSize)}
              title="Select Resume Font Size"
            >
              {RESUME_FONT_SIZES.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>
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

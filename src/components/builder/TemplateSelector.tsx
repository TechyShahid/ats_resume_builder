'use client';

import { useResume } from '@/context/ResumeContext';
import {
  TEMPLATE_LIST,
  RESUME_FONTS,
  RESUME_FONT_SIZES,
  type TemplateName,
  type ResumeFontFamily,
  type ResumeFontSize,
} from '@/types/resume';
import styles from './TemplateSelector.module.css';

export default function TemplateSelector() {
  const {
    selectedTemplate,
    setSelectedTemplate,
    selectedFont,
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
  } = useResume();

  return (
    <div className={styles.selector}>
      <h3 className={styles.title}>Choose a Template</h3>
      <p className={styles.subtitle}>All templates are ATS-optimized with clean, parseable layouts.</p>

      <div className={styles.grid}>
        {TEMPLATE_LIST.map((template) => (
          <button
            key={template.id}
            className={`${styles.card} ${selectedTemplate === template.id ? styles.active : ''}`}
            onClick={() => setSelectedTemplate(template.id as TemplateName)}
          >
            <div className={styles.preview} style={{ '--accent': template.accentColor } as React.CSSProperties}>
              <div className={styles.previewBar} />
              <div className={styles.previewLines}>
                <div className={styles.previewLine} style={{ width: '60%' }} />
                <div className={styles.previewLine} style={{ width: '40%' }} />
                <div className={styles.previewGap} />
                <div className={styles.previewLine} style={{ width: '100%' }} />
                <div className={styles.previewLine} style={{ width: '85%' }} />
                <div className={styles.previewLine} style={{ width: '70%' }} />
                <div className={styles.previewGap} />
                <div className={styles.previewLine} style={{ width: '90%' }} />
                <div className={styles.previewLine} style={{ width: '75%' }} />
              </div>
            </div>

            <div className={styles.info}>
              <span className={styles.name}>{template.name}</span>
              <span className={styles.bestFor}>{template.bestFor}</span>
            </div>

            {selectedTemplate === template.id && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Typography Customization */}
      <div className={styles.typographySection}>
        <h3 className={styles.title}>Typography & Styling</h3>
        <p className={styles.subtitle}>
          Customize font family and sizing to fine-tune spacing and visual impact.
        </p>

        <div className={styles.typographyGrid}>
          <div className={styles.controlGroup}>
            <label htmlFor="selector-font-family" className={styles.controlLabel}>
              Font Family
            </label>
            <select
              id="selector-font-family"
              className={styles.selectInput}
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value as ResumeFontFamily)}
            >
              {RESUME_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="selector-font-size" className={styles.controlLabel}>
              Font Size
            </label>
            <select
              id="selector-font-size"
              className={styles.selectInput}
              value={selectedFontSize}
              onChange={(e) => setSelectedFontSize(e.target.value as ResumeFontSize)}
            >
              {RESUME_FONT_SIZES.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

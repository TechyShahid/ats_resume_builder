'use client';

import { useResume } from '@/context/ResumeContext';
import { TEMPLATE_LIST } from '@/types/resume';
import type { TemplateName } from '@/types/resume';
import styles from './TemplateSelector.module.css';

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useResume();

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
    </div>
  );
}

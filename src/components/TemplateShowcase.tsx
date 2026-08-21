'use client';

import { useState } from 'react';
import { TEMPLATE_LIST } from '@/types/resume';
import styles from './TemplateShowcase.module.css';

// Mini resume preview content for template showcase
const sampleLines = {
  name: 'Sarah Johnson',
  title: 'Senior Software Engineer',
  sections: ['Summary', 'Experience', 'Education', 'Skills'],
};

export default function TemplateShowcase() {
  const [activeTemplate, setActiveTemplate] = useState(0);

  return (
    <section id="templates" className={`section ${styles.showcase}`}>
      <div className="container">
        <div className="badge badge-gradient" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          Templates
        </div>
        <h2 className="section-title">5 Premium ATS Templates</h2>
        <p className="section-subtitle">
          Each template is meticulously designed to be parseable by ATS systems while looking
          beautiful to recruiters.
        </p>

        <div className={styles.templateGrid}>
          {TEMPLATE_LIST.map((template, index) => (
            <button
              key={template.id}
              className={`${styles.templateCard} ${index === activeTemplate ? styles.active : ''}`}
              onClick={() => setActiveTemplate(index)}
            >
              {/* Mini Resume Preview */}
              <div className={styles.preview} style={{ '--accent': template.accentColor } as React.CSSProperties}>
                <div className={styles.previewHeader}>
                  <div className={styles.previewName}>{sampleLines.name}</div>
                  <div className={styles.previewTitle}>{sampleLines.title}</div>
                </div>
                <div className={styles.previewBody}>
                  {sampleLines.sections.map((section) => (
                    <div key={section} className={styles.previewSection}>
                      <div className={styles.previewSectionTitle}>{section}</div>
                      <div className={styles.previewLine} />
                      <div className={styles.previewLine} style={{ width: '85%' }} />
                      <div className={styles.previewLine} style={{ width: '70%' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.templateInfo}>
                <h4 className={styles.templateName}>{template.name}</h4>
                <p className={styles.templateDesc}>{template.description}</p>
                <span className="tag tag-accent">{template.bestFor}</span>
              </div>

              {index === activeTemplate && (
                <div className={styles.activeIndicator} />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

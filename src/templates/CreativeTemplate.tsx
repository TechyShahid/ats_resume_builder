import type { ResumeData } from '@/types/resume';
import styles from './CreativeTemplate.module.css';

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  return (
    <div className={styles.resume}>
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className={styles.headerContent}>
          <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
          <div className={styles.contact}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {summary && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>About</div>
            <p className={styles.summaryText}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Experience</div>
            {experience.map((exp) => (
              <div key={exp.id} className={styles.entry}>
                <div className={styles.timeline}>
                  <div className={styles.dot} />
                  <div className={styles.line} />
                </div>
                <div className={styles.entryContent}>
                  <div className={styles.entryHeader}>
                    <h3 className={styles.entryTitle}>{exp.position}</h3>
                    <span className={styles.date}>{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                  <p className={styles.company}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <ul className={styles.bullets}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Education</div>
            {education.map((edu) => (
              <div key={edu.id} className={styles.entry}>
                <div className={styles.timeline}>
                  <div className={styles.dot} />
                </div>
                <div className={styles.entryContent}>
                  <h3 className={styles.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className={styles.company}>{edu.institution} {edu.endDate && `· ${edu.endDate}`}</p>
                  {edu.gpa && <p className={styles.meta}>GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Skills</div>
            <div className={styles.skillCloud}>
              {skills.map((skill) => (
                <span key={skill.id} className={styles.skillChip}>{skill.name}</span>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Certifications</div>
            {certifications.map((cert) => (
              <p key={cert.id} className={styles.meta}>
                <strong>{cert.name}</strong> — {cert.issuer}
              </p>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Projects</div>
            {projects.map((proj) => (
              <div key={proj.id} className={styles.entry}>
                <div className={styles.timeline}><div className={styles.dot} /></div>
                <div className={styles.entryContent}>
                  <h3 className={styles.entryTitle}>{proj.name}</h3>
                  {proj.description && <p className={styles.meta}>{proj.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import type { ResumeData } from '@/types/resume';
import styles from './ModernTemplate.module.css';

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  return (
    <div className={styles.resume}>
      <div className={styles.header}>
        <div className={styles.accentBar} />
        <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
        <div className={styles.contact}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span className={styles.sep}>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span className={styles.sep}>|</span><span>{personalInfo.location}</span></>}
          {personalInfo.linkedin && <><span className={styles.sep}>|</span><span>{personalInfo.linkedin}</span></>}
        </div>
      </div>

      {summary && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p className={styles.text}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className={styles.entry}>
              <div className={styles.entryRow}>
                <h3 className={styles.entryTitle}>{exp.position}</h3>
                <span className={styles.entryDate}>{exp.startDate} — {exp.endDate || 'Present'}</span>
              </div>
              <p className={styles.entrySubtitle}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
              <ul className={styles.bullets}>
                {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className={styles.entry}>
              <div className={styles.entryRow}>
                <h3 className={styles.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <span className={styles.entryDate}>{edu.startDate} — {edu.endDate}</span>
              </div>
              <p className={styles.entrySubtitle}>{edu.institution}</p>
              {edu.gpa && <p className={styles.meta}>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.skillTags}>
            {skills.map((skill) => (
              <span key={skill.id} className={styles.skillTag}>{skill.name}</span>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Certifications</h2>
          {certifications.map((cert) => (
            <p key={cert.id} className={styles.text}>
              <strong>{cert.name}</strong> — {cert.issuer} {cert.date && `(${cert.date})`}
            </p>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className={styles.entry}>
              <h3 className={styles.entryTitle}>{proj.name}</h3>
              {proj.description && <p className={styles.text}>{proj.description}</p>}
              <ul className={styles.bullets}>
                {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

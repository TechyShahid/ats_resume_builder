import type { ResumeData } from '@/types/resume';
import FormattedText from '@/components/common/FormattedText';
import styles from './MinimalTemplate.module.css';

export default function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  return (
    <div className={styles.resume}>
      <div className={styles.header}>
        <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className={styles.contact}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join('  ·  ')}
          {personalInfo.linkedin && (
            <>
              {'  ·  '}
              <FormattedText text={personalInfo.linkedin} />
            </>
          )}
          {personalInfo.portfolio && (
            <>
              {'  ·  '}
              <FormattedText text={personalInfo.portfolio} />
            </>
          )}
        </div>
      </div>

      {summary && (
        <div className={styles.section}>
          <p className={styles.summary}><FormattedText text={summary} /></p>
        </div>
      )}

      {experience.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className={styles.entry}>
              <div className={styles.entryRow}>
                <span className={styles.entryTitle}>{exp.position}, <span className={styles.company}>{exp.company}</span></span>
                <span className={styles.date}>{exp.startDate} — {exp.endDate || 'Present'}</span>
              </div>
              <ul className={styles.bullets}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i}><FormattedText text={b} /></li>
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
                <span className={styles.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}, <span className={styles.company}>{edu.institution}</span></span>
                <span className={styles.date}>{edu.endDate}</span>
              </div>
              {edu.gpa && <p className={styles.meta}>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p className={styles.skillsList}>{skills.map(s => s.name).join('  ·  ')}</p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Certifications</h2>
          {certifications.map((cert) => (
            <p key={cert.id} className={styles.meta}>{cert.name} — {cert.issuer}{cert.date ? `, ${cert.date}` : ''}</p>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className={styles.entry}>
              <span className={styles.entryTitle}>{proj.name}</span>
              {proj.description && <p className={styles.meta}><FormattedText text={proj.description} /></p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

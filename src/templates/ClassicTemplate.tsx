import type { ResumeData } from '@/types/resume';
import styles from './ClassicTemplate.module.css';

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={styles.resume}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
        <div className={styles.contact}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Summary</h2>
          <div className={styles.divider} />
          <p className={styles.summaryText}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <div className={styles.divider} />
          {experience.map((exp) => (
            <div key={exp.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <h3 className={styles.entryTitle}>{exp.position}</h3>
                  <p className={styles.entryCompany}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                </div>
                <span className={styles.entryDate}>{exp.startDate} — {exp.endDate || 'Present'}</span>
              </div>
              <ul className={styles.bullets}>
                {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.divider} />
          {education.map((edu) => (
            <div key={edu.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <h3 className={styles.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className={styles.entryCompany}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                </div>
                <span className={styles.entryDate}>{edu.startDate} — {edu.endDate}</span>
              </div>
              {edu.gpa && <p className={styles.gpa}>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.divider} />
          {Object.entries(skillsByCategory).map(([category, skillList]) => (
            <p key={category} className={styles.skillLine}>
              <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong> {skillList.join(', ')}
            </p>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Certifications</h2>
          <div className={styles.divider} />
          {certifications.map((cert) => (
            <div key={cert.id} className={styles.certEntry}>
              <strong>{cert.name}</strong> — {cert.issuer} {cert.date && `(${cert.date})`}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.divider} />
          {projects.map((proj) => (
            <div key={proj.id} className={styles.entry}>
              <h3 className={styles.entryTitle}>{proj.name}</h3>
              {proj.description && <p className={styles.projDesc}>{proj.description}</p>}
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

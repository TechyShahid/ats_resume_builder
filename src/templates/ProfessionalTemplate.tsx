import type { ResumeData } from '@/types/resume';
import styles from './ProfessionalTemplate.module.css';

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={styles.resume}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
        </div>

        <div className={styles.sideSection}>
          <h3 className={styles.sideSectionTitle}>Contact</h3>
          <div className={styles.contactList}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className={styles.sideSection}>
            <h3 className={styles.sideSectionTitle}>Skills</h3>
            {Object.entries(skillsByCategory).map(([category, skillList]) => (
              <div key={category} className={styles.skillGroup}>
                <p className={styles.skillCategory}>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                {skillList.map((s, i) => (
                  <p key={i} className={styles.skillItem}>{s}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className={styles.sideSection}>
            <h3 className={styles.sideSectionTitle}>Certifications</h3>
            {certifications.map((cert) => (
              <div key={cert.id} className={styles.certItem}>
                <p className={styles.certName}>{cert.name}</p>
                <p className={styles.certIssuer}>{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {summary && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className={styles.text}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className={styles.entry}>
                <div className={styles.entryRow}>
                  <h3 className={styles.entryTitle}>{exp.position}</h3>
                  <span className={styles.entryDate}>{exp.startDate} — {exp.endDate || 'Present'}</span>
                </div>
                <p className={styles.entryCompany}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                <ul className={styles.bullets}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
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
                <h3 className={styles.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <p className={styles.entryCompany}>{edu.institution} {edu.endDate && `— ${edu.endDate}`}</p>
                {edu.gpa && <p className={styles.meta}>GPA: {edu.gpa}</p>}
              </div>
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
                  {proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

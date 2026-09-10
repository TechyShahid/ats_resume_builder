import type { ResumeData } from '@/types/resume';
import FormattedText from '@/components/common/FormattedText';
import styles from './CompactTemplate.module.css';

export default function CompactTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={styles.resume}>
      {/* Top Header */}
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
        </div>
        <div className={styles.contactGrid}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span><FormattedText text={personalInfo.linkedin} /></span>
          )}
          {personalInfo.portfolio && (
            <span><FormattedText text={personalInfo.portfolio} /></span>
          )}
        </div>
      </header>

      <div className={styles.bodyLayout}>
        {/* Left Sidebar: Skills, Education, Certifications */}
        <aside className={styles.sidebar}>
          {/* Skills */}
          {skills.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              {Object.entries(skillsByCategory).map(([category, list]) => (
                <div key={category} className={styles.skillsGroup}>
                  <div className={styles.skillCategory}>{category}</div>
                  <div className={styles.skillList}>{list.join(', ')}</div>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className={styles.eduItem}>
                  <h3 className={styles.eduDegree}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <p className={styles.eduSchool}>{edu.institution}</p>
                  <span className={styles.eduDate}>
                    {edu.startDate ? `${edu.startDate} - ` : ''}
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className={styles.certItem}>
                  <strong>{cert.name}</strong>
                  <div>
                    {cert.issuer} {cert.date && `(${cert.date})`}
                  </div>
                </div>
              ))}
            </section>
          )}
        </aside>

        {/* Main Column: Summary, Experience, Projects */}
        <main className={styles.mainCol}>
          {summary && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Profile</h2>
              <p className={styles.summaryText}><FormattedText text={summary} /></p>
            </section>
          )}

          {experience.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {experience.map((exp) => (
                <article key={exp.id} className={styles.entry}>
                  <div className={styles.entryHeader}>
                    <h3 className={styles.entryTitle}>{exp.position}</h3>
                    <span className={styles.entryDate}>
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className={styles.entryCompany}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <ul className={styles.bullets}>
                    {exp.bullets
                      .filter((b) => b.trim())
                      .map((bullet, i) => (
                        <li key={i}><FormattedText text={bullet} /></li>
                      ))}
                  </ul>
                </article>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} className={styles.projItem}>
                  <div className={styles.projHeader}>
                    <h3 className={styles.projName}>{proj.name}</h3>
                    {proj.url && <span className={styles.entryDate}>{proj.url}</span>}
                  </div>
                  {proj.description && <p className={styles.projDesc}><FormattedText text={proj.description} /></p>}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

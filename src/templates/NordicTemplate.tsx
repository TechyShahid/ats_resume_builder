import type { ResumeData } from '@/types/resume';
import FormattedText from '@/components/common/FormattedText';
import styles from './NordicTemplate.module.css';

export default function NordicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  const names = (personalInfo.fullName || 'Your Name').split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  return (
    <div className={styles.resume}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>
          {firstName} {lastName && <strong>{lastName}</strong>}
        </h1>
        {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
        <div className={styles.contact}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className={styles.contactDot}>·</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className={styles.contactDot}>·</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className={styles.contactDot}>·</span>
              <span><FormattedText text={personalInfo.linkedin} /></span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span className={styles.contactDot}>·</span>
              <span><FormattedText text={personalInfo.portfolio} /></span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Profile</div>
          <div className={styles.sectionContent}>
            <p className={styles.summaryText}><FormattedText text={summary} /></p>
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Experience</div>
          <div className={styles.sectionContent}>
            {experience.map((exp) => (
              <div key={exp.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <h3 className={styles.entryTitle}>{exp.position}</h3>
                  <span className={styles.entryDate}>
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className={styles.entryCompany}>
                  {exp.company}
                  {exp.location ? ` / ${exp.location}` : ''}
                </p>
                <ul className={styles.bullets}>
                  {exp.bullets
                    .filter((b) => b.trim())
                    .map((bullet, i) => (
                      <li key={i}><FormattedText text={bullet} /></li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Expertise</div>
          <div className={styles.sectionContent}>
            <div className={styles.skillsList}>
              {skills.map((skill) => (
                <span key={skill.id} className={styles.skillPill}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Projects</div>
          <div className={styles.sectionContent}>
            {projects.map((proj) => (
              <div key={proj.id} className={styles.projEntry}>
                <div className={styles.entryHeader}>
                  <h4 className={styles.projTitle}>{proj.name}</h4>
                  {proj.url && <span className={styles.entryDate}>{proj.url}</span>}
                </div>
                {proj.description && <p className={styles.projDesc}><FormattedText text={proj.description} /></p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Education</div>
          <div className={styles.sectionContent}>
            {education.map((edu) => (
              <div key={edu.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <h4 className={styles.entryTitle}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                  </h4>
                  <span className={styles.entryDate}>{edu.endDate}</span>
                </div>
                <p className={styles.entryCompany}>
                  {edu.institution}
                  {edu.location ? `, ${edu.location}` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Certifications</div>
          <div className={styles.sectionContent}>
            {certifications.map((cert) => (
              <div key={cert.id} className={styles.projEntry}>
                <span className={styles.projTitle}>{cert.name}</span>
                <span className={styles.projDesc}>
                  {cert.issuer} {cert.date && `(${cert.date})`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

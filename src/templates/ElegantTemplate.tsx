import type { ResumeData } from '@/types/resume';
import FormattedText from '@/components/common/FormattedText';
import styles from './ElegantTemplate.module.css';

export default function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={styles.resume}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}><FormattedText text={personalInfo.fullName || 'Your Name'} /></h1>
        {personalInfo.title && <p className={styles.title}><FormattedText text={personalInfo.title} /></p>}
        <div className={styles.contact}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className={styles.sep}>♦</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className={styles.sep}>♦</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className={styles.sep}>♦</span>
              <span><FormattedText text={personalInfo.linkedin} /></span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span className={styles.sep}>♦</span>
              <span><FormattedText text={personalInfo.portfolio} /></span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>Summary of Qualifications</h2>
          </div>
          <p className={styles.summaryText}><FormattedText text={summary} /></p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>Professional Experience</h2>
          </div>
          {experience.map((exp) => (
            <article key={exp.id} className={styles.entry}>
              <div className={styles.entryRow}>
                <h3 className={styles.entryTitle}>{exp.position}</h3>
                <span className={styles.entryDate}>
                  {exp.startDate} — {exp.endDate || 'Present'}
                </span>
              </div>
              <p className={styles.entryCompany}>
                {exp.company}
                {exp.location ? `, ${exp.location}` : ''}
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

      {/* Projects */}
      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>Notable Engagements & Projects</h2>
          </div>
          {projects.map((proj) => (
            <div key={proj.id} className={styles.entry}>
              <div className={styles.entryRow}>
                <h3 className={styles.entryTitle}>{proj.name}</h3>
                {proj.url && <span className={styles.entryDate}>{proj.url}</span>}
              </div>
              {proj.description && <p className={styles.projDesc}><FormattedText text={proj.description} /></p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionLine} />
            <h2 className={styles.sectionTitle}>Areas of Expertise</h2>
          </div>
          {Object.entries(skillsByCategory).map(([cat, list]) => (
            <p key={cat} className={styles.skillLine}>
              <strong>{cat}:</strong> {list.join(', ')}
            </p>
          ))}
        </section>
      )}

      {/* Education & Certifications */}
      {(education.length > 0 || certifications.length > 0) && (
        <div className={styles.twoCol}>
          {education.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeading}>
                <div className={styles.sectionLine} />
                <h2 className={styles.sectionTitle}>Education</h2>
              </div>
              {education.map((edu) => (
                <div key={edu.id} className={styles.eduItem}>
                  <div className={styles.entryRow}>
                    <h3 className={styles.eduDegree}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <span className={styles.entryDate}>{edu.endDate}</span>
                  </div>
                  <p className={styles.eduSchool}>
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ''}
                  </p>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeading}>
                <div className={styles.sectionLine} />
                <h2 className={styles.sectionTitle}>Credentials</h2>
              </div>
              <div>
                {certifications.map((cert) => (
                  <p key={cert.id} className={styles.certItem}>
                    <strong>{cert.name}</strong> — {cert.issuer} {cert.date && `(${cert.date})`}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

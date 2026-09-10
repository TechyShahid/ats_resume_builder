import type { ResumeData } from '@/types/resume';
import FormattedText from '@/components/common/FormattedText';
import styles from './ExecutiveTemplate.module.css';

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  return (
    <div className={styles.resume}>
      {/* Executive Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className={styles.title}>{personalInfo.title}</p>}
        <div className={styles.contact}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className={styles.diamond}>♦</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className={styles.diamond}>♦</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className={styles.diamond}>♦</span>
              <span><FormattedText text={personalInfo.linkedin} /></span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span className={styles.diamond}>♦</span>
              <span><FormattedText text={personalInfo.portfolio} /></span>
            </>
          )}
        </div>
      </header>

      {/* Executive Summary */}
      {summary && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Executive Profile</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.summaryText}><FormattedText text={summary} /></p>
        </section>
      )}

      {/* Core Competencies (Executive Skills Highlights) */}
      {skills.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Core Competencies & Expertise</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.competenciesGrid}>
            {skills.map((skill) => (
              <div key={skill.id} className={styles.competencyItem}>
                <span>▪</span>
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Executive Leadership Experience</h2>
            <div className={styles.sectionLine} />
          </div>
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
                {exp.location ? ` | ${exp.location}` : ''}
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
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Key Initiatives & Projects</h2>
            <div className={styles.sectionLine} />
          </div>
          {projects.map((proj) => (
            <article key={proj.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{proj.name}</h3>
                {proj.url && <span className={styles.entryDate}>{proj.url}</span>}
              </div>
              {proj.description && <p className={styles.projDesc}><FormattedText text={proj.description} /></p>}
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {proj.bullets
                    .filter((b) => b.trim())
                    .map((bullet, i) => (
                      <li key={i}><FormattedText text={bullet} /></li>
                    ))}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {/* Education & Certifications Row */}
      {(education.length > 0 || certifications.length > 0) && (
        <div className={styles.bottomRow}>
          {education.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Education</h2>
                <div className={styles.sectionLine} />
              </div>
              {education.map((edu) => (
                <div key={edu.id} className={styles.subEntry}>
                  <div className={styles.entryHeader}>
                    <h3 className={styles.subTitle}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <span className={styles.subDate}>
                      {edu.startDate ? `${edu.startDate} — ` : ''}
                      {edu.endDate}
                    </span>
                  </div>
                  <p className={styles.subSubtitle}>
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ''}
                  </p>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Certifications & Board Roles</h2>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.certList}>
                {certifications.map((cert) => (
                  <p key={cert.id} className={styles.certItem}>
                    <strong>{cert.name}</strong> — {cert.issuer}{' '}
                    {cert.date && `(${cert.date})`}
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

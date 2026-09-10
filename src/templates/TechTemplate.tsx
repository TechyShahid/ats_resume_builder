import type { ResumeData } from '@/types/resume';
import FormattedText from '@/components/common/FormattedText';
import styles from './TechTemplate.module.css';

export default function TechTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'technical';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={styles.resume}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.name}>{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className={styles.title}>&lt;{personalInfo.title} /&gt;</p>}
        </div>
        <div className={styles.contact}>
          {personalInfo.email && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>mail:</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>tel:</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>loc:</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>in:</span>
              <span><FormattedText text={personalInfo.linkedin} /></span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>web:</span>
              <span><FormattedText text={personalInfo.portfolio} /></span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.slash}>//</span> 01. Overview
            <div className={styles.titleLine} />
          </div>
          <p className={styles.summaryText}><FormattedText text={summary} /></p>
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.slash}>//</span> 02. Technical Skills Matrix
            <div className={styles.titleLine} />
          </div>
          <div className={styles.skillsContainer}>
            {Object.entries(skillsByCategory).map(([cat, list]) => (
              <div key={cat} className={styles.skillRow}>
                <span className={styles.skillCategory}>{cat}:</span>
                <div className={styles.skillList}>
                  {list.map((name, i) => (
                    <span key={i} className={styles.skillBadge}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.slash}>//</span> 03. Experience & Engineering Roles
            <div className={styles.titleLine} />
          </div>
          {experience.map((exp) => (
            <article key={exp.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div>
                  <h3 className={styles.entryTitle}>{exp.position}</h3>
                  <span className={styles.entryCompany}>
                    {' '}@ {exp.company}
                    {exp.location && <span className={styles.entryMeta}> ({exp.location})</span>}
                  </span>
                </div>
                <span className={styles.entryDate}>
                  {exp.startDate} — {exp.endDate || 'Present'}
                </span>
              </div>
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
          <div className={styles.sectionTitle}>
            <span className={styles.slash}>//</span> 04. Technical Projects
            <div className={styles.titleLine} />
          </div>
          <div className={styles.projectsGrid}>
            {projects.map((proj) => (
              <div key={proj.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <h4 className={styles.projectName}>{proj.name}</h4>
                  {proj.url && <span className={styles.projectLink}>{proj.url}</span>}
                </div>
                {proj.description && <p className={styles.projectDesc}><FormattedText text={proj.description} /></p>}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className={styles.techTags}>
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      {(education.length > 0 || certifications.length > 0) && (
        <div className={styles.twoCol}>
          {education.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <span className={styles.slash}>//</span> 05. Education
                <div className={styles.titleLine} />
              </div>
              {education.map((edu) => (
                <div key={edu.id} className={styles.eduItem}>
                  <div className={styles.entryHeader}>
                    <h4 className={styles.eduDegree}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                    </h4>
                    <span className={styles.eduDate}>{edu.endDate}</span>
                  </div>
                  <p className={styles.eduSchool}>
                    {edu.institution}
                    {edu.location ? ` · ${edu.location}` : ''}
                  </p>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                <span className={styles.slash}>//</span> 06. Certifications
                <div className={styles.titleLine} />
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

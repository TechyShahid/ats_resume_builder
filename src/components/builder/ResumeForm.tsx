'use client';

import { useState, useRef } from 'react';
import { HiPlus, HiTrash, HiSparkles } from 'react-icons/hi2';
import { useResume } from '@/context/ResumeContext';
import { generateId } from '@/types/resume';
import type { WorkExperience, Education, Skill, Certification, Project } from '@/types/resume';
import RichToolbar from './RichToolbar';
import styles from './ResumeForm.module.css';

function BulletInputItem({
  value,
  onChange,
  onRemove,
  placeholder = 'Led development of...',
}: {
  value: string;
  onChange: (val: string) => void;
  onRemove: () => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSelection = (type: 'bold' | 'italic' | 'link' | 'color') => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = value.substring(start, end);
    let replacement = '';
    let newCursorPos = start;

    if (type === 'bold') {
      replacement = selected ? `**${selected}**` : '**bold**';
      newCursorPos = start + replacement.length;
    } else if (type === 'italic') {
      replacement = selected ? `*${selected}*` : '*italic*';
      newCursorPos = start + replacement.length;
    } else if (type === 'link') {
      const url = prompt('Enter URL (e.g. https://example.com):', 'https://');
      if (!url) return;
      replacement = `[${selected || 'link'}](${url})`;
      newCursorPos = start + replacement.length;
    } else if (type === 'color') {
      const color = prompt('Enter hex color or CSS color name (e.g. #2563eb):', '#2563eb');
      if (!color) return;
      replacement = `[color=${color}]${selected || 'colored text'}[/color]`;
      newCursorPos = start + replacement.length;
    }

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={styles.bulletRow}>
      <span className={styles.bulletDot}>•</span>
      <input
        ref={inputRef}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.bulletFormatActions}>
        <button
          type="button"
          className={styles.miniFormatBtn}
          onClick={() => formatSelection('bold')}
          title="Make selection Bold (**text**)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={styles.miniFormatBtn}
          onClick={() => formatSelection('italic')}
          title="Make selection Italic (*text*)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={styles.miniFormatBtn}
          onClick={() => formatSelection('link')}
          title="Insert Hyperlink"
        >
          🔗
        </button>
        <button
          type="button"
          className={styles.miniFormatBtn}
          onClick={() => formatSelection('color')}
          title="Text Color ([color=#hex]text[/color])"
        >
          🎨
        </button>
      </div>
      <button className={styles.removeBulletBtn} onClick={onRemove} title="Delete bullet">
        <HiTrash />
      </button>
    </div>
  );
}

export default function ResumeForm() {
  const { resumeData, updateField, setIsProcessing, setProcessingMessage } = useResume();
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const optimizeSection = async (type: string, data: unknown, onResult: (result: unknown) => void) => {
    setOptimizing(type);
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
      if (response.ok) {
        const result = await response.json();
        onResult(result.data);
      }
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setOptimizing(null);
    }
  };

  const optimizeSummary = () => {
    optimizeSection('summary', {
      name: resumeData.personalInfo.fullName,
      title: resumeData.personalInfo.title,
      experience: resumeData.experience,
      skills: resumeData.skills,
    }, (result: unknown) => {
      const data = result as { summary: string };
      if (data.summary) updateField('summary', data.summary);
    });
  };

  const optimizeBullets = (expId: string, bullets: string[]) => {
    optimizeSection('bullets', bullets, (result: unknown) => {
      const improved = result as string[];
      if (Array.isArray(improved)) {
        updateField('experience', resumeData.experience.map(exp =>
          exp.id === expId ? { ...exp, bullets: improved } : exp
        ));
      }
    });
  };

  // --- Personal Info ---
  const updatePersonalInfo = (field: string, value: string) => {
    updateField('personalInfo', { ...resumeData.personalInfo, [field]: value });
  };

  // --- Experience ---
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: generateId(), company: '', position: '', location: '',
      startDate: '', endDate: '', current: false, bullets: [''],
    };
    updateField('experience', [...resumeData.experience, newExp]);
  };

  const updateExperience = (id: string, field: string, value: unknown) => {
    updateField('experience', resumeData.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    updateField('experience', resumeData.experience.filter(exp => exp.id !== id));
  };

  const addBullet = (expId: string) => {
    updateField('experience', resumeData.experience.map(exp =>
      exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
    ));
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    updateField('experience', resumeData.experience.map(exp =>
      exp.id === expId ? {
        ...exp,
        bullets: exp.bullets.map((b, i) => i === bulletIdx ? value : b),
      } : exp
    ));
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    updateField('experience', resumeData.experience.map(exp =>
      exp.id === expId ? {
        ...exp,
        bullets: exp.bullets.filter((_, i) => i !== bulletIdx),
      } : exp
    ));
  };

  // --- Education ---
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(), institution: '', degree: '', field: '',
      location: '', startDate: '', endDate: '', gpa: '', achievements: [],
    };
    updateField('education', [...resumeData.education, newEdu]);
  };

  const updateEducation = (id: string, field: string, value: unknown) => {
    updateField('education', resumeData.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    updateField('education', resumeData.education.filter(edu => edu.id !== id));
  };

  // --- Skills ---
  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState<Skill['category']>('technical');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill: Skill = { id: generateId(), name: newSkill.trim(), category: skillCategory };
    updateField('skills', [...resumeData.skills, skill]);
    setNewSkill('');
  };

  const removeSkill = (id: string) => {
    updateField('skills', resumeData.skills.filter(s => s.id !== id));
  };

  // --- Certifications ---
  const addCertification = () => {
    const cert: Certification = { id: generateId(), name: '', issuer: '', date: '', url: '' };
    updateField('certifications', [...resumeData.certifications, cert]);
  };

  const updateCertification = (id: string, field: string, value: string) => {
    updateField('certifications', resumeData.certifications.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const removeCertification = (id: string) => {
    updateField('certifications', resumeData.certifications.filter(c => c.id !== id));
  };

  // --- Projects ---
  const addProject = () => {
    const proj: Project = {
      id: generateId(), name: '', description: '',
      techStack: [], url: '', bullets: [''],
    };
    updateField('projects', [...resumeData.projects, proj]);
  };

  const updateProject = (id: string, field: string, value: unknown) => {
    updateField('projects', resumeData.projects.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removeProject = (id: string) => {
    updateField('projects', resumeData.projects.filter(p => p.id !== id));
  };

  return (
    <div className={styles.form}>
      {/* Personal Information */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.grid2}>
          <div className="input-group">
            <label className="input-label">Full Name *</label>
            <input className="input" placeholder="John Doe" value={resumeData.personalInfo.fullName}
              data-field-path="personalInfo.fullName" data-field-label="Full Name"
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Professional Title</label>
            <input className="input" placeholder="Senior Software Engineer" value={resumeData.personalInfo.title}
              data-field-path="personalInfo.title" data-field-label="Job Title"
              onChange={(e) => updatePersonalInfo('title', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Email *</label>
            <input className="input" type="email" placeholder="john@example.com" value={resumeData.personalInfo.email}
              data-field-path="personalInfo.email" data-field-label="Email"
              onChange={(e) => updatePersonalInfo('email', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone</label>
            <input className="input" placeholder="+1 (555) 123-4567" value={resumeData.personalInfo.phone}
              data-field-path="personalInfo.phone" data-field-label="Phone"
              onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Location</label>
            <input className="input" placeholder="San Francisco, CA" value={resumeData.personalInfo.location}
              data-field-path="personalInfo.location" data-field-label="Location"
              onChange={(e) => updatePersonalInfo('location', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">LinkedIn</label>
            <input className="input" placeholder="linkedin.com/in/johndoe" value={resumeData.personalInfo.linkedin}
              data-field-path="personalInfo.linkedin" data-field-label="LinkedIn"
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Professional Summary</h3>
          <button
            className={`btn btn-sm btn-secondary ${styles.aiBtn}`}
            onClick={optimizeSummary}
            disabled={optimizing === 'summary'}
          >
            <HiSparkles /> {optimizing === 'summary' ? 'Optimizing...' : 'AI Optimize'}
          </button>
        </div>
        <RichToolbar
          textareaRef={summaryRef}
          value={resumeData.summary}
          onChange={(val) => updateField('summary', val)}
          label="Formatting: select text and click B, I, or Link"
        />
        <textarea
          ref={summaryRef}
          className="input textarea"
          placeholder="Results-driven software engineer with 8+ years of experience..."
          value={resumeData.summary}
          data-field-path="summary" data-field-label="Summary"
          onChange={(e) => updateField('summary', e.target.value)}
          rows={4}
        />
      </div>

      {/* Work Experience */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Work Experience</h3>
          <button className="btn btn-sm btn-secondary" onClick={addExperience}>
            <HiPlus /> Add Experience
          </button>
        </div>

        {resumeData.experience.map((exp, expIndex) => (
          <div key={exp.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <h4 className={styles.entryTitle}>{exp.position || exp.company || 'New Experience'}</h4>
              <button className={styles.deleteBtn} onClick={() => removeExperience(exp.id)}>
                <HiTrash />
              </button>
            </div>

            <div className={styles.grid2}>
              <div className="input-group">
                <label className="input-label">Position</label>
                <input className="input" placeholder="Software Engineer" value={exp.position}
                  data-field-path={`experience.${expIndex}.position`} data-field-label={`Exp #${expIndex+1} Position`}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Company</label>
                <input className="input" placeholder="Google" value={exp.company}
                  data-field-path={`experience.${expIndex}.company`} data-field-label={`Exp #${expIndex+1} Company`}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input className="input" placeholder="Jan 2020" value={exp.startDate}
                  data-field-path={`experience.${expIndex}.startDate`} data-field-label={`Exp #${expIndex+1} Start Date`}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <input className="input" placeholder="Present" value={exp.endDate}
                  data-field-path={`experience.${expIndex}.endDate`} data-field-label={`Exp #${expIndex+1} End Date`}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Location</label>
                <input className="input" placeholder="Mountain View, CA" value={exp.location}
                  data-field-path={`experience.${expIndex}.location`} data-field-label={`Exp #${expIndex+1} Location`}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} />
              </div>
            </div>

            <div className={styles.bulletsSection}>
              <div className={styles.bulletHeader}>
                <label className="input-label">Achievements & Responsibilities</label>
                <button
                  className={`btn btn-sm btn-ghost ${styles.aiBtn}`}
                  onClick={() => optimizeBullets(exp.id, exp.bullets)}
                  disabled={optimizing === `bullets-${exp.id}`}
                >
                  <HiSparkles /> Enhance
                </button>
              </div>
              {exp.bullets.map((bullet, idx) => (
                <BulletInputItem
                  key={idx}
                  value={bullet}
                  onChange={(val) => updateBullet(exp.id, idx, val)}
                  onRemove={() => removeBullet(exp.id, idx)}
                />
              ))}
              <button className={`btn btn-ghost btn-sm ${styles.addBulletBtn}`} onClick={() => addBullet(exp.id)}>
                <HiPlus /> Add Bullet
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Education</h3>
          <button className="btn btn-sm btn-secondary" onClick={addEducation}>
            <HiPlus /> Add Education
          </button>
        </div>

        {resumeData.education.map((edu, eduIndex) => (
          <div key={edu.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <h4 className={styles.entryTitle}>{edu.institution || 'New Education'}</h4>
              <button className={styles.deleteBtn} onClick={() => removeEducation(edu.id)}>
                <HiTrash />
              </button>
            </div>
            <div className={styles.grid2}>
              <div className="input-group">
                <label className="input-label">Institution</label>
                <input className="input" placeholder="MIT" value={edu.institution}
                  data-field-path={`education.${eduIndex}.institution`} data-field-label={`Edu #${eduIndex+1} Institution`}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Degree</label>
                <input className="input" placeholder="Bachelor of Science" value={edu.degree}
                  data-field-path={`education.${eduIndex}.degree`} data-field-label={`Edu #${eduIndex+1} Degree`}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Field of Study</label>
                <input className="input" placeholder="Computer Science" value={edu.field}
                  data-field-path={`education.${eduIndex}.field`} data-field-label={`Edu #${eduIndex+1} Field`}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">GPA</label>
                <input className="input" placeholder="3.8/4.0" value={edu.gpa}
                  data-field-path={`education.${eduIndex}.gpa`} data-field-label={`Edu #${eduIndex+1} GPA`}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input className="input" placeholder="Sep 2016" value={edu.startDate}
                  data-field-path={`education.${eduIndex}.startDate`} data-field-label={`Edu #${eduIndex+1} Start`}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <input className="input" placeholder="Jun 2020" value={edu.endDate}
                  data-field-path={`education.${eduIndex}.endDate`} data-field-label={`Edu #${eduIndex+1} End`}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <div className={styles.skillInput}>
          <input
            className="input"
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
          <select
            className={`input ${styles.categorySelect}`}
            value={skillCategory}
            onChange={(e) => setSkillCategory(e.target.value as Skill['category'])}
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft Skill</option>
            <option value="tools">Tools</option>
            <option value="languages">Languages</option>
            <option value="other">Other</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={addSkill}>
            <HiPlus />
          </button>
        </div>

        <div className={styles.skillTags}>
          {resumeData.skills.map((skill) => (
            <span key={skill.id} className={`tag ${styles.skillTag}`}>
              {skill.name}
              <button className={styles.removeTag} onClick={() => removeSkill(skill.id)}>
                <HiTrash />
              </button>
            </span>
          ))}
          {resumeData.skills.length === 0 && (
            <p className={styles.emptyText}>No skills added yet. Type a skill and press Enter.</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Certifications</h3>
          <button className="btn btn-sm btn-secondary" onClick={addCertification}>
            <HiPlus /> Add Certification
          </button>
        </div>

        {resumeData.certifications.map((cert, certIndex) => (
          <div key={cert.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <h4 className={styles.entryTitle}>{cert.name || 'New Certification'}</h4>
              <button className={styles.deleteBtn} onClick={() => removeCertification(cert.id)}>
                <HiTrash />
              </button>
            </div>
            <div className={styles.grid2}>
              <div className="input-group">
                <label className="input-label">Certification Name</label>
                <input className="input" placeholder="AWS Solutions Architect" value={cert.name}
                  data-field-path={`certifications.${certIndex}.name`} data-field-label={`Cert #${certIndex+1} Name`}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Issuer</label>
                <input className="input" placeholder="Amazon Web Services" value={cert.issuer}
                  data-field-path={`certifications.${certIndex}.issuer`} data-field-label={`Cert #${certIndex+1} Issuer`}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Date</label>
                <input className="input" placeholder="Mar 2023" value={cert.date}
                  data-field-path={`certifications.${certIndex}.date`} data-field-label={`Cert #${certIndex+1} Date`}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Projects</h3>
          <button className="btn btn-sm btn-secondary" onClick={addProject}>
            <HiPlus /> Add Project
          </button>
        </div>

        {resumeData.projects.map((proj, projIndex) => (
          <div key={proj.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <h4 className={styles.entryTitle}>{proj.name || 'New Project'}</h4>
              <button className={styles.deleteBtn} onClick={() => removeProject(proj.id)}>
                <HiTrash />
              </button>
            </div>
            <div className={styles.grid2}>
              <div className="input-group">
                <label className="input-label">Project Name</label>
                <input className="input" placeholder="E-Commerce Platform" value={proj.name}
                  data-field-path={`projects.${projIndex}.name`} data-field-label={`Project #${projIndex+1} Name`}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">URL</label>
                <input className="input" placeholder="github.com/..." value={proj.url}
                  data-field-path={`projects.${projIndex}.url`} data-field-label={`Project #${projIndex+1} URL`}
                  onChange={(e) => updateProject(proj.id, 'url', e.target.value)} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="input-label" style={{ margin: 0 }}>Description</label>
                  <span style={{ fontSize: '0.688rem', color: 'var(--text-muted)' }}>Supports **bold**, *italic*, [link](url)</span>
                </div>
                <textarea className="input textarea" placeholder="Built a full-stack platform using **Next.js** and [Stripe API](https://stripe.com)..." value={proj.description}
                  data-field-path={`projects.${projIndex}.description`} data-field-label={`Project #${projIndex+1} Description`}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)} rows={2} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

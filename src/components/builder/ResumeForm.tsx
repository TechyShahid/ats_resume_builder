'use client';

import { useState } from 'react';
import { HiPlus, HiTrash, HiSparkles } from 'react-icons/hi2';
import { useResume } from '@/context/ResumeContext';
import { generateId } from '@/types/resume';
import type { WorkExperience, Education, Skill, Certification, Project } from '@/types/resume';
import styles from './ResumeForm.module.css';

export default function ResumeForm() {
  const { resumeData, updateField, setIsProcessing, setProcessingMessage } = useResume();
  const [optimizing, setOptimizing] = useState<string | null>(null);

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
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Professional Title</label>
            <input className="input" placeholder="Senior Software Engineer" value={resumeData.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Email *</label>
            <input className="input" type="email" placeholder="john@example.com" value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone</label>
            <input className="input" placeholder="+1 (555) 123-4567" value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Location</label>
            <input className="input" placeholder="San Francisco, CA" value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">LinkedIn</label>
            <input className="input" placeholder="linkedin.com/in/johndoe" value={resumeData.personalInfo.linkedin}
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
        <textarea
          className="input textarea"
          placeholder="Results-driven software engineer with 8+ years of experience..."
          value={resumeData.summary}
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

        {resumeData.experience.map((exp) => (
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
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Company</label>
                <input className="input" placeholder="Google" value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input className="input" placeholder="Jan 2020" value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <input className="input" placeholder="Present" value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Location</label>
                <input className="input" placeholder="Mountain View, CA" value={exp.location}
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
                <div key={idx} className={styles.bulletRow}>
                  <span className={styles.bulletDot}>•</span>
                  <input
                    className="input"
                    placeholder="Led development of..."
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                  />
                  <button className={styles.removeBulletBtn} onClick={() => removeBullet(exp.id, idx)}>
                    <HiTrash />
                  </button>
                </div>
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

        {resumeData.education.map((edu) => (
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
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Degree</label>
                <input className="input" placeholder="Bachelor of Science" value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Field of Study</label>
                <input className="input" placeholder="Computer Science" value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">GPA</label>
                <input className="input" placeholder="3.8/4.0" value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input className="input" placeholder="Sep 2016" value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <input className="input" placeholder="Jun 2020" value={edu.endDate}
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

        {resumeData.certifications.map((cert) => (
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
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Issuer</label>
                <input className="input" placeholder="Amazon Web Services" value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Date</label>
                <input className="input" placeholder="Mar 2023" value={cert.date}
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

        {resumeData.projects.map((proj) => (
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
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">URL</label>
                <input className="input" placeholder="github.com/..." value={proj.url}
                  onChange={(e) => updateProject(proj.id, 'url', e.target.value)} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Description</label>
                <textarea className="input textarea" placeholder="Built a full-stack..." value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)} rows={2} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

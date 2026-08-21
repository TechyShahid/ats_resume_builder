'use client';

import { HiShieldCheck, HiSparkles, HiDocumentText, HiArrowPath, HiPaintBrush, HiCloudArrowDown } from 'react-icons/hi2';
import styles from './Features.module.css';

const features = [
  {
    icon: <HiShieldCheck />,
    title: 'ATS Optimized',
    description: 'Every template is designed to pass Applicant Tracking Systems. Clean, parseable layouts with standard section headings.',
  },
  {
    icon: <HiSparkles />,
    title: 'AI-Powered Enhancement',
    description: 'Gemini AI rewrites your bullet points with action verbs, metrics, and industry keywords for maximum impact.',
  },
  {
    icon: <HiDocumentText />,
    title: 'Smart Resume Parsing',
    description: 'Upload your existing PDF or DOCX resume and our AI instantly extracts and structures all your information.',
  },
  {
    icon: <HiArrowPath />,
    title: 'Real-Time Preview',
    description: 'See changes reflected instantly across all templates. Switch between designs with a single click.',
  },
  {
    icon: <HiPaintBrush />,
    title: '5 Premium Templates',
    description: 'Classic, Modern, Minimal, Professional, and Creative — each crafted for different industries and roles.',
  },
  {
    icon: <HiCloudArrowDown />,
    title: 'Text-Based PDF Export',
    description: 'Downloads are true text PDFs — not screenshots. Every word is selectable and ATS-readable.',
  },
];

export default function Features() {
  return (
    <section id="features" className={`section ${styles.features}`}>
      <div className="container">
        <div className="badge badge-gradient" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          Features
        </div>
        <h2 className="section-title">Everything You Need to<br />Land Your Dream Job</h2>
        <p className="section-subtitle">
          Powered by cutting-edge AI, our builder ensures your resume stands out to both
          ATS software and human recruiters.
        </p>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={`card card-glow ${styles.featureCard}`} style={{ animationDelay: `${index * 100}ms` }}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

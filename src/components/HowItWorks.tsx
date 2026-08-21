'use client';

import { HiCloudArrowUp, HiSparkles, HiDocumentArrowDown } from 'react-icons/hi2';
import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: <HiCloudArrowUp />,
    number: '01',
    title: 'Upload Your Resume',
    description: 'Drop your existing PDF or DOCX resume, or start building from scratch. Our AI reads and understands your content instantly.',
  },
  {
    icon: <HiSparkles />,
    number: '02',
    title: 'AI Optimizes Content',
    description: 'Gemini AI parses your resume into structured data, rewrites bullet points with action verbs, and adds quantifiable metrics.',
  },
  {
    icon: <HiDocumentArrowDown />,
    number: '03',
    title: 'Choose Template & Download',
    description: 'Pick from 5 ATS-friendly templates, preview in real-time, and download a clean text-based PDF ready to submit.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={`section ${styles.howItWorks}`}>
      <div className="container">
        <div className="badge badge-gradient" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          How It Works
        </div>
        <h2 className="section-title">3 Simple Steps to Your<br />Perfect Resume</h2>
        <p className="section-subtitle">
          From upload to download in minutes. No design skills needed — just your experience
          and our AI.
        </p>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && <div className={styles.connector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

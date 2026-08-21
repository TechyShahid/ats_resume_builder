'use client';

import Link from 'next/link';
import { HiSparkles, HiArrowRight } from 'react-icons/hi2';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Animated background orbs */}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.content}>
        <div className={`badge badge-gradient ${styles.badge}`}>
          <HiSparkles /> Powered by AI
        </div>

        <h1 className={styles.title}>
          Build <span className={styles.gradient}>ATS-Friendly</span> Resumes
          <br />That Land Interviews
        </h1>

        <p className={styles.subtitle}>
          Upload your resume and let AI optimize it for Applicant Tracking Systems.
          Choose from 5 premium templates designed to pass ATS filters and impress recruiters.
        </p>

        <div className={styles.actions}>
          <Link href="/builder" className="btn btn-primary btn-lg">
            Build Your Resume <HiArrowRight />
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">
            See How It Works
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>ATS Templates</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>AI</span>
            <span className={styles.statLabel}>Powered Optimization</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>PDF</span>
            <span className={styles.statLabel}>Text-Based Export</span>
          </div>
        </div>
      </div>
    </section>
  );
}

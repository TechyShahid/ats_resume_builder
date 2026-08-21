import Link from 'next/link';
import { HiSparkles } from 'react-icons/hi2';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Build Your<br />Winning Resume?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of professionals who landed their dream jobs with ATS-optimized resumes.
          </p>
          <Link href="/builder" className="btn btn-primary btn-lg">
            <HiSparkles /> Start Building — It&apos;s Free
          </Link>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <HiSparkles />
            </div>
            <span className={styles.logoText}>ResumeAI</span>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ResumeAI. Built with Next.js & Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
}

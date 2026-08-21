'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiSparkles } from 'react-icons/hi2';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <HiSparkles />
          </div>
          <span className={styles.logoText}>ResumeAI</span>
        </Link>

        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#templates" className={styles.navLink}>Templates</a>
          <a href="#how-it-works" className={styles.navLink}>How it Works</a>
        </div>

        <Link href="/builder" className="btn btn-primary btn-sm">
          Build Resume
        </Link>
      </div>
    </nav>
  );
}

// src/components/HomepageComponents/StayCoordinated.js
import React from 'react';
import Link from '@docusaurus/Link';
import styles from './StayCoordinated.module.css';

function ConnectButton({ icon, title, subtitle, href, variant }) {
  return (
    <Link 
      to={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.connectButton} ${styles[variant]}`}
    >
      <div className={styles.buttonIcon}>
        {icon}
      </div>
      <div className={styles.buttonText}>
        <span>{subtitle}</span>
        <span>{title}</span>
      </div>
    </Link>
  );
}

export default function StayCoordinated() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Stay Coordinated</h2>
          <p>Connect with us and join our community</p>
        </div>
        
        <div className={styles.buttonsGrid}>
          <ConnectButton
            icon={
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M19 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V8h14v12zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
                      fill="currentColor"/>
              </svg>
            }
            title="Calendar"
            subtitle="View Our"
            href="https://lu.ma/calendar/cal-DywZJnk1m1uAMlD"
            variant="calendar"
          />

          <ConnectButton
            icon={
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"/>
              </svg>
            }
            title="Streams"
            subtitle="Join Our"
            href="https://forms.gle/iFaehTPDDJuGuUcT9"
            variant="stream"
          />

          <ConnectButton
            icon={
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                      fill="currentColor"/>
              </svg>
            }
            title="Email"
            subtitle="Send Us"
            href="mailto:contact@eq-network.org"
            variant="email"
          />
        </div>
      </div>
    </section>
  );
}

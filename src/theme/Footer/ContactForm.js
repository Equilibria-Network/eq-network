// src/theme/Footer/ContactForm.js
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Tooltip } from '@site/src/utils/tooltip';
import styles from './ContactForm.module.css';

function ContactForm() {
  // const [state, handleSubmit] = useForm("xblydgqv");
   const [state, handleSubmit] = useForm("xanjokba");
  
  if (state.succeeded) {
    return (
      <div>
        <h2 className={styles.title}>Contact Us</h2>
        <div className={styles.successMessage}>
          <p className={styles.successTitle}>Thank you for your message!</p>
          <p className={styles.successText}>We'll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactForm}>
      <h2 className={styles.title}>Contact Us</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Your name"
              required
            />
            <ValidationError 
              prefix="Name" 
              field="name"
              errors={state.errors}
              className={styles.validationError}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Your email"
              required
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
              className={styles.validationError}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            placeholder="Your message"
            required
          />
          <ValidationError 
            prefix="Message" 
            field="message"
            errors={state.errors}
            className={styles.validationError}
          />
        </div>

        <button 
          type="submit" 
          className={`${styles.submitButton} ${
            state.submitting ? styles.submitButtonDisabled : styles.submitButtonActive
          }`}
          disabled={state.submitting}
        >
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
        
        <ValidationError 
          errors={state.errors}
          className={styles.validationError}
        />
      </form>
    </div>
  );
}

function StayCoordinated() {
  const ConnectButton = ({ icon, title, subtitle, href }) => (
    <Tooltip content={`${subtitle} ${title}`}>
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.connectButton}
      >
        <div className={styles.connectIcon}>
          {icon}
        </div>
        <div className={styles.connectContent}>
          <span className={styles.connectSubtitle}>{subtitle}</span>
          <span className={styles.connectTitle}>{title}</span>
        </div>
      </a>
    </Tooltip>
  );

  return (
    <div className={styles.stayCoordinated}>
      <h2 className={styles.coordinatedTitle}>Stay Coordinated</h2>
      <p className={styles.coordinatedDescription}>Connect with us and join our community</p>
      
      <div className={styles.connectGrid}>
        <ConnectButton
          icon={
            <img 
              src="/img/socials/luma.svg" 
              alt="Luma Calendar" 
              className={styles.connectSvg}
            />
          }
          title="Calendar"
          subtitle="View Our"
          href="https://lu.ma/calendar/cal-DywZJnk1m1uAMlD"
        />
      </div>
    </div>
  );
}

export { ContactForm, StayCoordinated };

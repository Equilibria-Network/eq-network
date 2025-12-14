// src/components/layout/ContactForm.tsx
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const formspreeEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
  const [state, handleSubmit] = useForm(formspreeEndpoint);
  
  if (state.succeeded) {
    return (
      <div className={styles.contactForm}>
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
            rows={5}
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

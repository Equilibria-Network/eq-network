// src/components/layout/ContactForm.tsx
import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styles from './ContactForm.module.css';

// Simple fallback form without Formspree
function FallbackContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:contact@eq-network.org?subject=Contact from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Your name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Your email"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Your message"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${styles.submitButtonActive}`}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

// Formspree-powered form
function FormspreeContactForm({ endpoint }: { endpoint: string }) {
  const [state, handleSubmit] = useForm(endpoint);

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

// Main component that decides which form to render
export default function ContactForm() {
  const formspreeEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;

  // If no endpoint is configured, use the fallback mailto form
  if (!formspreeEndpoint) {
    return <FallbackContactForm />;
  }

  // Otherwise use Formspree
  return <FormspreeContactForm endpoint={formspreeEndpoint} />;
}

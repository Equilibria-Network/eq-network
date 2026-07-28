// src/components/layout/ContactForm.tsx
import { useForm, ValidationError } from '@formspree/react';
import { siteContent } from '@content/site';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const c = siteContent.contact;
  const formspreeEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
  const [state, handleSubmit] = useForm(formspreeEndpoint || 'placeholder');

  if (state.succeeded) {
    return (
      <div className={styles.contactForm}>
        <h2 className={styles.title}>{c.heading}</h2>
        <div className={styles.successMessage}>
          <p className={styles.successTitle}>{c.successTitle}</p>
          <p className={styles.successText}>{c.successText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactForm}>
      <h2 className={styles.title}>{c.heading}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className="sr-only">
              {c.fields.name.label}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder={c.fields.name.placeholder}
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
            <label htmlFor="email" className="sr-only">
              {c.fields.email.label}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder={c.fields.email.placeholder}
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
          <label htmlFor="message" className="sr-only">
            {c.fields.message.label}
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            placeholder={c.fields.message.placeholder}
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
          {state.submitting ? c.submitting : c.submit}
        </button>

        <ValidationError errors={state.errors} className={styles.validationError} />
      </form>
      <p className={styles.privacyNotice}>
        {c.privacyNotice.text} <a href="/privacy">{c.privacyNotice.linkLabel}</a>.
      </p>
    </div>
  );
}

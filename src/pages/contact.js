// src/pages/contact.js
import React from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function Contact() {
  return (
    <Layout title="Contact">
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Contact Us</h1>
          <div className={styles.content}>
            <p>Get in touch with us to learn more about our work or discuss potential collaborations.</p>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5"></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}

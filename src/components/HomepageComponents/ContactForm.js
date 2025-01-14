// src/components/HomepageComponents/ContactForm.js
import React, { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Here you would typically send to your backend
    // For now, we'll just open the mail client
    const mailtoLink = `mailto:contact@eq-network.org?subject=Contact Form Submission from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    setStatus('sent');
    
    // Clear form after sending
    setFormData({
      name: '',
      email: '',
      message: ''
    });

    // Reset status after 3 seconds
    setTimeout(() => setStatus(''), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.card}>
            <h2>Get in Touch</h2>
            <p>Have a question or want to learn more? Send us a message and we'll get back to you.</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email<span className={styles.required}>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="5"
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 
                 status === 'sent' ? 'Sent!' : 
                 'Send Message'}
              </button>

              {status === 'error' && (
                <div className={styles.error}>
                  There was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

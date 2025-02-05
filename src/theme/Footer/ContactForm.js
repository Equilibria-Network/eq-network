// src/theme/Footer/ContactForm.js
import React, { useState } from 'react';
import clsx from 'clsx';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const mailtoLink = `mailto:contact@eq-network.org?subject=Contact Form Submission from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    setStatus('sent');
    
    setFormData({
      name: '',
      email: '',
      message: ''
    });

    setTimeout(() => setStatus(''), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
              placeholder="Your name"
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
              placeholder="Your email"
            />
          </div>
        </div>

        <div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
            placeholder="Your message"
          />
        </div>

        <button 
          type="submit" 
          className={clsx(
            "px-6 py-2 rounded-md font-medium transition-colors",
            status === 'sending' 
              ? "bg-white/20 text-white/50 cursor-not-allowed" 
              : "bg-white text-[var(--ifm-color-primary-darkest)] hover:bg-white/90"
          )}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : 
           status === 'sent' ? 'Sent!' : 
           'Send Message'}
        </button>
      </form>
    </div>
  );
}

function StayCoordinated() {
  const ConnectButton = ({ icon, title, subtitle, href }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center p-6 rounded-xl border-2 border-[var(--ifm-color-primary)] text-[var(--ifm-color-primary)] hover:transform hover:-translate-y-1 transition-transform"
    >
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[var(--ifm-color-primary-lightest)] rounded-full">
        {icon}
      </div>
      <span className="text-sm opacity-80">{subtitle}</span>
      <span className="font-bold">{title}</span>
    </a>
  );

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-[var(--ifm-color-primary)]">Stay Coordinated</h2>
      <p className="text-[var(--ifm-color-emphasis-700)] mb-8">Connect with us and join our community</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConnectButton
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor">
              <path d="M19 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V8h14v12z" />
            </svg>
          }
          title="Calendar"
          subtitle="View Our"
          href="https://lu.ma/calendar/cal-DywZJnk1m1uAMlD"
        />

        <ConnectButton
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" />
            </svg>
          }
          title="Streams"
          subtitle="Join Our"
          href="https://forms.gle/iFaehTPDDJuGuUcT9"
        />

        <ConnectButton
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          }
          title="Email"
          subtitle="Send Us"
          href="mailto:contact@eq-network.org"
        />
      </div>
    </div>
  );
}

export { ContactForm, StayCoordinated };

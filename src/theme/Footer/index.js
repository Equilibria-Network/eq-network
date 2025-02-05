// src/theme/Footer/index.js
import React from 'react';
import { ContactForm } from './ContactForm';
import SocialBar from './SocialBar';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--ifm-color-primary-darkest)] text-white">
      {/* Social Links Bar - Easy to comment out */}
      <SocialBar />
      
      <div className="max-w-[var(--ifm-container-width)] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-3">
            <img 
              src="/img/logo_icon_text_2.svg"
              alt="Equilibria Network"
              className="h-8 mb-4"
            />
            <p className="text-sm opacity-80 mb-4">
              Fostering resilience, agency, and positive-sum collaboration in hybrid human-AI systems.
            </p>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-6">
            <ContactForm />
          </div>
          
          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-4">Stay Coordinated</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://lu.ma/calendar/cal-DywZJnk1m1uAMlD"
                  className="text-white hover:text-[var(--equilibria-blue-light)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Calendar
                </a>
              </li>
              <li>
                <a 
                  href="https://forms.gle/iFaehTPDDJuGuUcT9"
                  className="text-white hover:text-[var(--equilibria-blue-light)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Our Streams
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-sm opacity-60 text-center">
          © {new Date().getFullYear()} Equilibria Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

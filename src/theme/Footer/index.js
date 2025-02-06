// src/theme/Footer/index.js
import React from 'react';
import { ContactForm } from './ContactForm';
import SocialBar from './SocialBar';

const GradientDivider = ({ width = 'md' }) => {
  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div className={`relative w-full ${widthClasses[width]}`}>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--ifm-color-primary-darkest)] text-white">
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
        
        <GradientDivider width="lg" />
        
        {/* Enhanced Copyright */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center space-x-2 text-sm font-light tracking-wide">
            <span className="text-white/60">© {new Date().getFullYear()}</span>
            <span className="text-white/80">Equilibria Network</span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-light text-white/40">
          </div>
        </div>
      </div>
    </footer>
  );
}

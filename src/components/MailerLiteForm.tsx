import React, { useEffect } from 'react';

declare global {
  interface Window {
    ml: any;
  }
}

const MailerLiteForm = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.mailerlite.com/js/universal.js';
    script.async = true;

    window.ml = window.ml || function() {
      (window.ml.q = window.ml.q || []).push(arguments);
    };

    document.body.appendChild(script);

    script.onload = () => {
      window.ml('account', '1210546');
    };

    return () => {
      document.body.removeChild(script);
      delete window.ml;
    };
  }, []);

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-serif text-[#1a3c5b]" style={{ fontFamily: 'Freight Text Pro, serif' }}>Join Our Network</h2>
      <p className="text-black/80 leading-relaxed max-w-lg mx-auto">
        Join us in developing the frameworks and tools needed for effective coordination in an increasingly complex world.
      </p>
      <div className="ml-embedded" data-form="NU2hRJ"></div>
    </div>
  );
};

export default MailerLiteForm;
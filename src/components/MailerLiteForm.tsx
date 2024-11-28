import React, { useEffect } from 'react';

const MailerLiteForm = () => {
  useEffect(() => {
    // Create script element for Universal JS
    const script = document.createElement('script');
    script.src = 'https://assets.mailerlite.com/js/universal.js';
    script.async = true;

    // Initialize MailerLite
    window.ml = window.ml || function() {
      (window.ml.q = window.ml.q || []).push(arguments);
    };

    // Add script to document
    document.body.appendChild(script);

    // Initialize account once script loads
    script.onload = () => {
      window.ml('account', '1210546');
    };

    // Cleanup
    return () => {
      document.body.removeChild(script);
      delete window.ml;
    };
  }, []);

  return (
    <section className="text-center space-y-6 bg-emerald-50/50 backdrop-blur-sm p-8 rounded-xl border border-emerald-100">
      <div className="ml-embedded" data-form="NU2hRJ"></div>
    </section>
  );
};

export default MailerLiteForm;
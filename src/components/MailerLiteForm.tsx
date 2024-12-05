import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    ml: any;
    ml_account: string;
    ml_webform_5876300: any;
  }
}

const MailerLiteForm = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Set the account ID globally
    window.ml_account = '1210546';

    // Create and load the universal script
    const script = document.createElement('script');
    script.src = 'https://static.mailerlite.com/js/universal.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleShowForm = () => {
    if (window.ml && isScriptLoaded) {
      window.ml('show', {
        'accountId': '1210546',
        'formId': 'NU2hRJ'  // Replace with your actual form ID
      });
    } else {
      console.log('MailerLite script not loaded yet');
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-serif text-[#1a3c5b]" style={{ fontFamily: 'Freight Text Pro, serif' }}>
        Stay Up To Date
      </h2>
      <p className="text-black/80 leading-relaxed max-w-lg mx-auto">
        Subscribe to our newsletter to stay up to date with new articles that we'll release and events we will run.
      </p>
      <Button 
        onClick={handleShowForm}
        className="w-full max-w-md mx-auto bg-[#057b4b] hover:bg-[#046b41] text-white"
      >
        Subscribe to Our Newsletter
      </Button>
    </div>
  );
};

export default MailerLiteForm;
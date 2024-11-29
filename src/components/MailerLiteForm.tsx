import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    ml: any;
  }
}

const MailerLiteForm = () => {
  useEffect(() => {
    // Create and load the universal script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
      .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
      n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
      (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
      ml('account', '1210546');
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleShowForm = () => {
    if (window.ml) {
      window.ml('show', 'NU2hRJ', true);
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
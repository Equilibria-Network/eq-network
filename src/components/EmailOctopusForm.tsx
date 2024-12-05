import React, { useEffect } from 'react';

const EmailOctopusForm = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://eocampaign1.com/form/4523a72a-b2ef-11ef-a45b-954f85fc5502.js";
    script.async = true;
    script.setAttribute('data-form', '4523a72a-b2ef-11ef-a45b-954f85fc5502');
    
    // Add the script to the newsletter section specifically
    const newsletterSection = document.getElementById('newsletter-section');
    if (newsletterSection) {
      newsletterSection.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6 relative">
      <h2 className="text-3xl font-serif text-[#1a3c5b] text-center mb-6">Stay Up To Date</h2>
      <p className="text-black/80 leading-relaxed max-w-lg mx-auto text-center">
        Subscribe to our newsletter to stay up to date with new articles that we'll release and events we will run.
      </p>
      <div id="4523a72a-b2ef-11ef-a45b-954f85fc5502" className="relative z-10" />
      
      <style jsx global>{`
        #4523a72a-b2ef-11ef-a45b-954f85fc5502 {
          max-width: 32rem;
          margin: 0 auto;
        }
        #4523a72a-b2ef-11ef-a45b-954f85fc5502 h2,
        #4523a72a-b2ef-11ef-a45b-954f85fc5502 p {
          display: none;
        }
        #4523a72a-b2ef-11ef-a45b-954f85fc5502 .email-octopus-form {
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default EmailOctopusForm;
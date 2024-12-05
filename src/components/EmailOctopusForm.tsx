import React, { useEffect } from 'react';

const EmailOctopusForm = () => {
  useEffect(() => {
    // Add the EmailOctopus script
    const script = document.createElement('script');
    script.src = "https://eocampaign1.com/form/4523a72a-b2ef-11ef-a45b-954f85fc5502.js";
    script.async = true;
    script.setAttribute('data-form', '4523a72a-b2ef-11ef-a45b-954f85fc5502');
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
      // Also remove any form elements EmailOctopus might have added
      const form = document.getElementById('4523a72a-b2ef-11ef-a45b-954f85fc5502');
      if (form) form.remove();
    };
  }, []);

  return (
    <div className="text-center space-y-6">
      {/* This is where EmailOctopus will inject its form */}
      <div id="4523a72a-b2ef-11ef-a45b-954f85fc5502"></div>
      
      {/* Add some custom CSS to style the injected form */}
      <style jsx global>{`
        /* Style the EmailOctopus form to match your site */
        #4523a72a-b2ef-11ef-a45b-954f85fc5502 {
          max-width: 32rem;
          margin: 0 auto;
        }
        
        /* Hide the duplicate title if needed */
        #4523a72a-b2ef-11ef-a45b-954f85fc5502 h2 {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default EmailOctopusForm;
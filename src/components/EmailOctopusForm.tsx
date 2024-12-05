import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

const EmailOctopusForm = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Create and load the EmailOctopus script
    const script = document.createElement('script');
    script.src = "https://eocampaign1.com/form/4523a72a-b2ef-11ef-a45b-954f85fc5502.js";
    script.async = true;
    script.setAttribute('data-form', '4523a72a-b2ef-11ef-a45b-954f85fc5502');
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-serif text-[#1a3c5b]">
        Stay Up To Date
      </h2>
      <p className="text-black/80 leading-relaxed max-w-lg mx-auto">
        Subscribe to our newsletter to stay up to date with new articles that we'll release and events we will run.
      </p>
      {/* EmailOctopus will automatically inject the form into this div */}
      <div id="4523a72a-b2ef-11ef-a45b-954f85fc5502"></div>
    </div>
  );
};

export default EmailOctopusForm;
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const EmailOctopusForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://eocampaign1.com/form/4523a72a-b2ef-11ef-a45b-954f85fc5502', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field_0: email, // Email field
          source: 'website'
        })
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-serif text-[#1a3c5b]">
        Stay Up To Date
      </h2>
      <p className="text-black/80 leading-relaxed max-w-lg mx-auto">
        Subscribe to our newsletter to stay up to date with new articles that we'll release and events we will run.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-2 rounded-md border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Button 
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#057b4b] hover:bg-[#046b41] text-white"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        
        {status === 'success' && (
          <p className="text-green-600">Thank you for subscribing!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default EmailOctopusForm;
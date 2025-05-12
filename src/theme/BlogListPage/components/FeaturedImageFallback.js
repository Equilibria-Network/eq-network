// src/theme/BlogListPage/FeaturedImageFallback.js
import React from 'react';

// This component generates a random gradient background for posts without images
export default function FeaturedImageFallback({ title }) {
  // Generate a deterministic "random" color based on the title
  const getColorFromTitle = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate primary and secondary colors for the gradient
    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 40) % 360;
    
    return {
      primary: `hsl(${h1}, 70%, 65%)`,
      secondary: `hsl(${h2}, 80%, 60%)`
    };
  };

  const colors = getColorFromTitle(title);
  
  // Get the first letter of each word in the title
  const getInitials = (title) => {
    return title
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className="featured-image-fallback"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      <span className="fallback-initials">
        {getInitials(title)}
      </span>
    </div>
  );
}

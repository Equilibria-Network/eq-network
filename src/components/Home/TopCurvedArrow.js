// src/components/HomepageComponents/TopCurvedArrow.js
import React from 'react';

const TopCurvedArrow = ({ className, color = 'currentColor', width = 130, height = 72 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 131.05 72.83" 
      width={width} 
      height={height} 
      className={className}
    >
      <g strokeLinecap="round">
        <g transform="translate(11.47 52.72) rotate(0 55.76 -14.18)">
          <path 
            d="M-1.47 -2.72 C5.06 -8.77, 25.15 -33.33, 37.76 -38.9 C50.37 -44.47, 62.22 -44.3, 74.19 -36.13 C86.16 -27.96, 103.27 2.77, 109.58 10.1 M2.93 1.97 C9.46 -3.54, 25.42 -30.35, 37.04 -36.38 C48.66 -42.4, 60.63 -41.05, 72.64 -34.16 C84.66 -27.28, 103.08 -2.16, 109.11 4.94" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(11.47 52.72) rotate(0 55.76 -14.18)">
          <path 
            d="M85.78 -6.01 C91.49 -4.31, 96.79 -2.8, 110.26 5.31 M86.78 -7.05 C92.71 -4.9, 99.18 -0.84, 109.65 5.67" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(11.47 52.72) rotate(0 55.76 -14.18)">
          <path 
            d="M99.1 -16.73 C101.39 -12.42, 103.36 -8.23, 110.26 5.31 M100.11 -17.77 C102.27 -12.79, 105.05 -5.76, 109.65 5.67" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};

export default TopCurvedArrow;

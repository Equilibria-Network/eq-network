// src/components/HomepageComponents/VerticalArrow.js
import React from 'react';

const VerticalArrow = ({ className, color = 'currentColor', width = 44, height = 93 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 44.75 93.84" 
      width={width} 
      height={height} 
      className={className}
    >
      <g strokeLinecap="round">
        <g transform="translate(59.27 43.10) rotate(268.32 -36.41 4.20)">
          <path 
            d="M1.05 -0.74 C-3.69 -1.94, -20.14 -10.51, -28.5 -7.77 C-36.85 -5.03, -41.73 14.91, -49.11 15.68 C-56.49 16.45, -68.62 0.27, -72.75 -3.13 M0.14 1.48 C-4.72 0.44, -21.48 -8.88, -29.29 -6.84 C-37.1 -4.81, -39.53 13.44, -46.72 13.69 C-53.92 13.94, -68.2 -2.27, -72.47 -5.36" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(59.27 43.10) rotate(268.32 -36.41 4.20)">
          <path 
            d="M-58.12 0.52 C-63.25 -0.71, -67.99 -4.05, -72.47 -5.36 M-58.12 0.52 C-63.93 -2.13, -68.95 -3.76, -72.47 -5.36" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(59.27 43.10) rotate(268.32 -36.41 4.20)">
          <path 
            d="M-65.25 8.37 C-68.26 4.78, -70.91 -0.86, -72.47 -5.36 M-65.25 8.37 C-68.53 2.89, -71.01 -1.54, -72.47 -5.36" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};

export default VerticalArrow;

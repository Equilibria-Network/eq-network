// src/components/HomepageComponents/BottomCurvedArrow.js
import React from 'react';

const BottomCurvedArrow = ({ className, color = 'currentColor', width = 136, height = 72 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 136.85 72.88" 
      width={width} 
      height={height} 
      className={className}
    >
      <g strokeLinecap="round">
        <g transform="translate(123.92 22.07) rotate(0 -55.76 14.18)">
          <path 
            d="M-1.47 -2.72 C-6.6 3.52, -20.21 29.04, -32.18 34.82 C-44.14 40.59, -59.69 38.87, -73.24 31.92 C-86.78 24.96, -107.16 -0.06, -113.45 -6.91 M2.93 1.97 C-2.2 8.74, -19.95 32.02, -32.9 37.34 C-45.85 42.66, -61.28 42.12, -74.79 33.88 C-88.29 25.65, -107.36 -4.99, -113.92 -12.07" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(123.92 22.07) rotate(0 -55.76 14.18)">
          <path 
            d="M-94.8 3.38 C-99.45 -1.75, -104.77 -6.84, -112.78 -11.7 M-93.79 2.33 C-99.42 -3.23, -104.7 -6.48, -113.39 -11.34" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(123.92 22.07) rotate(0 -55.76 14.18)">
          <path 
            d="M-108.38 13.77 C-109.54 6.12, -111.46 -1.57, -112.78 -11.7 M-107.37 12.73 C-109.17 4.42, -110.7 -1.7, -113.39 -11.34" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};

export default BottomCurvedArrow;

// src/components/HomepageComponents/VerticalDoubleArrow.js
import React from 'react';

const VerticalDoubleArrow = ({ className, color = 'currentColor', width = 122, height = 188 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 122.08 188.61" 
      width={width} 
      height={height} 
      className={className}
    >
      <g strokeLinecap="round">
        <g transform="translate(-18.23 81.04) rotate(268.32 55.76 -14.18)">
          <path 
            d="M-0.01 -0.61 C5.82 -6.75, 22.45 -30.75, 34.7 -36.51 C46.96 -42.28, 60.71 -42.55, 73.54 -35.21 C86.37 -27.87, 105.15 0.18, 111.67 7.51 M-1.47 1.68 C4.19 -4.86, 21.26 -32.42, 33.62 -38.46 C45.98 -44.49, 59.62 -42.28, 72.68 -34.52 C85.75 -26.76, 105.47 0.8, 111.99 8.1" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(-18.23 81.04) rotate(268.32 55.76 -14.18)">
          <path 
            d="M90.55 -4.75 C95.57 -1.59, 103.17 2.16, 111.99 8.1 M90.55 -4.75 C95.83 -1.78, 99.62 0.81, 111.99 8.1" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(-18.23 81.04) rotate(268.32 55.76 -14.18)">
          <path 
            d="M103.82 -15.53 C105.15 -9.35, 109.04 -2.58, 111.99 8.1 M103.82 -15.53 C106.45 -10.5, 107.57 -5.74, 111.99 8.1" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
      </g>
      <g strokeLinecap="round">
        <g transform="translate(141.92 106.42) rotate(268.32 -55.76 14.18)">
          <path 
            d="M-0.26 0.34 C-6.12 6.39, -22.92 30.22, -35.14 35.67 C-47.36 41.12, -61.03 40.35, -73.57 33.03 C-86.1 25.71, -104.13 -1.37, -110.37 -8.25 M1.8 -0.52 C-4.23 5.68, -23.51 30.86, -36.18 36.58 C-48.86 42.31, -61.42 41.09, -74.25 33.83 C-87.08 26.56, -106.85 -0.09, -113.17 -7.01" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(141.92 106.42) rotate(268.32 -55.76 14.18)">
          <path 
            d="M-91.55 5.54 C-97.39 1.44, -106.42 -1.77, -113.17 -7.01 M-91.55 5.54 C-95.93 3.08, -101.47 0.85, -113.17 -7.01" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
        <g transform="translate(141.92 106.42) rotate(268.32 -55.76 14.18)">
          <path 
            d="M-104.68 16.5 C-106.53 9.15, -111.63 2.65, -113.17 -7.01 M-104.68 16.5 C-106.31 11.64, -109 7.02, -113.17 -7.01" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};

export default VerticalDoubleArrow;

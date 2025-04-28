// src/components/HomepageComponents/Arrows.js
import React from 'react';

export const TopCurvedArrow = ({ className, color = 'currentColor', width = 130, height = 72 }) => {
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

export const BottomCurvedArrow = ({ className, color = 'currentColor', width = 136, height = 72 }) => {
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

export const VerticalArrow = ({ className, color = 'currentColor', width = 44, height = 93 }) => {
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

export const VerticalDoubleArrow = ({ className, color = 'currentColor', width = 122, height = 188 }) => {
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

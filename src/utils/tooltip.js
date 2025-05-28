// src/utils/tooltip.js
import tippy from 'tippy.js';

// Global tooltip configuration
export const globalTippyConfig = {
  theme: 'equilibria',
  animation: 'shift-away',
  arrow: true,
  placement: 'top',
  duration: [300, 200],
  delay: [200, 0],
  interactive: false,
  maxWidth: 300,
  allowHTML: true,
  appendTo: () => document.body,
  hideOnClick: true,
  trigger: 'mouseenter focus',
  zIndex: 9999
};

// Custom hook for consistent tooltips
export const useTooltip = (content, config = {}) => {
  return {
    ...globalTippyConfig,
    ...config,
    content
  };
};

// Helper function to create tooltips programmatically
export const createTooltip = (element, content, config = {}) => {
  return tippy(element, {
    ...globalTippyConfig,
    ...config,
    content
  });
};

// React component wrapper for tooltips
import React from 'react';
import Tippy from '@tippyjs/react';

export const Tooltip = ({ children, content, ...props }) => {
  return (
    <Tippy
      {...globalTippyConfig}
      {...props}
      content={content}
    >
      {children}
    </Tippy>
  );
};

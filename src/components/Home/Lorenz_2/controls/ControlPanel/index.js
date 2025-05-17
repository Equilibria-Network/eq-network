// src/components/Home/Lorenz/controls/ControlPanel/index.js
/**
 * Main Control Panel component for the Lorenz attractor visualization.
 * 
 * This component provides a draggable, tabbed control panel for advanced
 * interaction with the Lorenz attractor simulation. It handles shared panel
 * state and delegates tab-specific rendering to separate components.
 * 
 * Responsibilities:
 * - Manages panel visibility, position, and size
 * - Handles dragging and resizing
 * - Manages tab switching
 * - Coordinates mouse/touch interaction
 * - Delegates tab content to specialized components
 * 
 * Dependencies:
 * - TabInfo.js: For information tab content
 * - TabParams.js: For parameters tab content
 * - TabData.js: For data tab content
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Move, 
  Info,
  Sliders,
  BarChart
} from 'lucide-react';
import styles from './ControlPanel.module.css';
import TabInfo from './TabInfo';
import TabParams from './TabParams';
import TabData from './TabData';

const ControlPanel = ({ 
  visible,
  onClose,
  systemParams,
  currentPoint,
  currentRates,
  onParamChange,
  visualizationType = 'standard' // Used to determine which info to show
}) => {
  const panelRef = useRef(null);
  const resizeHandleRef = useRef(null);
  
  // Panel state
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'params', 'data'
  const [isEditMode, setIsEditMode] = useState(false); // Toggle for edit mode in params tab
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  
  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [panelSize, setPanelSize] = useState({ width: 400, height: 'auto' });

  // Detect if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Position panel at a good starting position based on window size
  useEffect(() => {
    // Set initial position based on screen size
    if (isMobile) {
      // On mobile: position at bottom center
      const initialX = (window.innerWidth - 350) / 2;
      const initialY = window.innerHeight - 500;
      
      setPosition({ x: initialX, y: initialY });
      
      // Set initial size for mobile
      setPanelSize({
        width: Math.min(350, window.innerWidth - 20),
        height: 'auto'
      });
    } else {
      // On desktop: position at top right
      const initialX = Math.max(window.innerWidth - 450, 20);
      const initialY = 80;
      
      setPosition({ x: initialX, y: initialY });
    }
  }, [isMobile]);
  
  // Handle mousedown/touchstart for dragging the panel
  const handleDragStart = (e) => {
    // Get event coordinates, supporting both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Prevent dragging when interacting with controls or when minimized
    if (
      e.target.tagName === 'INPUT' || 
      e.target.tagName === 'BUTTON' || 
      e.target === resizeHandleRef.current ||
      e.target.closest(`.${styles.tabButtons}`) ||
      e.target.closest(`.${styles.controlButtons}`)
    ) {
      return;
    }
    
    setIsDragging(true);
    
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
    
    // Change cursor and prevent text selection
    document.body.style.cursor = 'grabbing';
    if (e.preventDefault) e.preventDefault();
  };
  
  // Handle mousedown/touchstart for resizing the panel
  const handleResizeStart = (e) => {
    // Get event coordinates, supporting both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    
    setResizeStart({
      x: clientX,
      y: clientY
    });
    
    document.body.style.cursor = 'nwse-resize';
    if (e.preventDefault) e.preventDefault();
  };
  
  // Handle mouseup/touchend to end drag or resize
  const handleEnd = () => {
    if (isDragging || isResizing) {
      document.body.style.cursor = '';
      setIsDragging(false);
      setIsResizing(false);
    }
  };
  
  // Handle mousemove/touchmove for both dragging and resizing
  const handleMove = (e) => {
    // Get event coordinates, supporting both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Handle dragging
    if (isDragging) {
      // Calculate new position in pixels
      const newLeft = clientX - dragOffset.x;
      const newTop = clientY - dragOffset.y;
      
      // Get viewport boundaries
      const minX = -panelSize.width + 100; // Allow panel to be dragged mostly off-screen
      const maxX = window.innerWidth - 100; // Keep at least 100px visible
      const minY = 0;
      const maxY = window.innerHeight - 50;
      
      // Set direct pixel positioning with boundaries
      setPosition({
        x: Math.min(Math.max(newLeft, minX), maxX),
        y: Math.min(Math.max(newTop, minY), maxY)
      });
    }
    
    // Handle resizing
    if (isResizing) {
      const deltaX = clientX - resizeStart.x;
      const deltaY = clientY - resizeStart.y;
      
      const rect = panelRef.current.getBoundingClientRect();
      
      // Set minimum sizes to prevent panel from becoming too small
      const minWidth = isMobile ? 300 : 350;
      const newWidth = Math.max(minWidth, rect.width + deltaX);
      const newHeight = isMinimized ? 40 : Math.max(200, rect.height + deltaY);
      
      // On mobile, limit width to screen width - 20px for margins
      const maxWidth = isMobile ? window.innerWidth - 20 : 600;
      
      setPanelSize({
        width: Math.min(newWidth, maxWidth),
        height: isMinimized ? 40 : newHeight
      });
      
      // Update resize start position
      setResizeStart({
        x: clientX,
        y: clientY
      });
    }
  };
  
  // Toggle panel minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      // Restore previous height when maximizing
      setPanelSize(prev => ({
        ...prev,
        height: 'auto'
      }));
    } else {
      // Set fixed height when minimizing
      setPanelSize(prev => ({
        ...prev,
        height: 40
      }));
    }
  };
  
  // Set up event listeners for dragging and resizing
  useEffect(() => {
    // Mouse events
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);
    
    return () => {
      // Clean up mouse events
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      
      // Clean up touch events
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
      
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, resizeStart]);
  
  // Generate panel class names
  const panelClassNames = [
    styles.controlPanel,
    !visible ? styles.hidden : '',
    isDragging ? styles.dragging : '',
    isResizing ? styles.resizing : '',
    isMinimized ? styles.minimized : '',
    isMobile ? styles.mobilePanel : ''
  ].filter(Boolean).join(' ');
  
  // Set panel style based on position and size
  const panelStyle = {
    top: `${position.y}px`,
    left: `${position.x}px`,
    width: panelSize.width + 'px',
    height: panelSize.height === 'auto' ? 'auto' : panelSize.height + 'px'
  };
  
  return (
    <div 
      ref={panelRef}
      className={panelClassNames} 
      style={panelStyle}
    >
      {/* Header bar with tabs and controls */}
      <div 
        className={styles.headerBar}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className={styles.moveHandle}>
          <Move size={16} />
        </div>
        
        <div className={styles.panelTitle}>
          Lorenz System
        </div>
        
        <div className={styles.controlButtons}>
          <button 
            className={styles.controlButton}
            onClick={toggleMinimize}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button 
            className={styles.controlButton}
            onClick={onClose}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Tab buttons */}
      {!isMinimized && (
        <div className={styles.tabButtons}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('info')}
            title="Information"
          >
            <Info size={16} />
            <span>Info</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'params' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('params')}
            title="Parameters"
          >
            <Sliders size={16} />
            <span>Parameters</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'data' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('data')}
            title="Real-time Data"
          >
            <BarChart size={16} />
            <span>Data</span>
          </button>
        </div>
      )}
      
      {/* Tab content - delegate to specialized components */}
      {!isMinimized && (
        <>
          {activeTab === 'info' && (
            <TabInfo visualizationType={visualizationType} />
          )}
          
          {activeTab === 'params' && (
            <TabParams
              systemParams={systemParams}
              onParamChange={onParamChange}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              visualizationType={visualizationType}
            />
          )}
          
          {activeTab === 'data' && (
            <TabData
              currentPoint={currentPoint}
              currentRates={currentRates}
              visualizationType={visualizationType}
            />
          )}
        </>
      )}
      
      {/* Resize handle - only show on desktop */}
      {!isMobile && (
        <div 
          ref={resizeHandleRef}
          className={styles.resizeHandle}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        >
          <div className={styles.resizeDots}></div>
        </div>
      )}

      {/* Mobile indicator text at bottom of panel */}
      {isMobile && !isMinimized && (
        <div className={styles.mobileIndicator}>
          <div className={styles.dragIndicator}>
            <Move size={12} />
            <span>Drag to move</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;

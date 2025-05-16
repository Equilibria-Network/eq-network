// src/components/Home/Lorenz/ControlPanel.js
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

const ControlPanel = ({ 
  visible,
  onClose,
  systemParams,
  currentPoint,
  currentRates,
  onParamChange
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
  
  // Format number with consistent precision
  const formatNumber = (num, precision = 2) => {
    // Handle both string and number inputs
    return Number(num).toFixed(precision);
  };
  
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
  
  // Render different tab content based on active tab
  const renderTabContent = () => {
    if (isMinimized) return null;
    
    switch (activeTab) {
      case 'info':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Lorenz Attractor:</div>
              <p className={styles.description}>
                The Lorenz attractor is a set of chaotic solutions to the Lorenz system,
                which is a system of ordinary differential equations. It was first studied by
                Edward Lorenz in 1963 and is notable for its butterfly-shaped appearance.
              </p>
            </div>
            
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Equations:</div>
              <div className={styles.codeBlock}>
                dx/dt = σ(y - x)<br/>
                dy/dt = x(ρ - z) - y<br/>
                dz/dt = xy - βz
              </div>
            </div>
            
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Chaos Theory:</div>
              <p className={styles.description}>
                The Lorenz system exhibits chaotic behavior, meaning small changes in initial 
                conditions can lead to vastly different trajectories - a property known as 
                the "butterfly effect."
              </p>
            </div>
          </div>
        );
      
      case 'params':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <div className={styles.sectionTitle}>Parameters</div>
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`${styles.editButton} ${isEditMode ? styles.activeEditButton : ''}`}
                title={isEditMode ? "View Mode" : "Edit Mode"}
                aria-label={isEditMode ? "View Mode" : "Edit Mode"}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="18" 
                  height="18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
            </div>
            
            {isEditMode ? (
              // Edit mode - show sliders
              <>
                <div className={styles.section}>
                  <p className={styles.description}>
                    Adjust the parameters below to see how they affect the Lorenz attractor.
                    Changes are applied in real-time.
                  </p>
                  
                  <div className={styles.sliderContainer}>
                    <label className={styles.sliderLabel}>
                      <span>σ (sigma): {formatNumber(systemParams.sigma, 2)}</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        step="0.1" 
                        value={systemParams.sigma} 
                        onChange={(e) => onParamChange('sigma', parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderRange}>
                        <span>1</span>
                        <span>20</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.sliderContainer}>
                    <label className={styles.sliderLabel}>
                      <span>ρ (rho): {formatNumber(systemParams.rho, 2)}</span>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="50" 
                        step="0.1" 
                        value={systemParams.rho} 
                        onChange={(e) => onParamChange('rho', parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderRange}>
                        <span>0.1</span>
                        <span>50</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.sliderContainer}>
                    <label className={styles.sliderLabel}>
                      <span>β (beta): {formatNumber(systemParams.beta, 2)}</span>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="10" 
                        step="0.1" 
                        value={systemParams.beta} 
                        onChange={(e) => onParamChange('beta', parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderRange}>
                        <span>0.5</span>
                        <span>10</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.sliderContainer}>
                    <label className={styles.sliderLabel}>
                      <span>dt (time step): {formatNumber(systemParams.dt, 4)}</span>
                      <input 
                        type="range" 
                        min="0.0001" 
                        max="0.01" 
                        step="0.0001" 
                        value={systemParams.dt} 
                        onChange={(e) => onParamChange('dt', parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderRange}>
                        <span>0.0001</span>
                        <span>0.01</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.sliderContainer}>
                    <label className={styles.sliderLabel}>
                      <span>noise: {formatNumber(systemParams.noise, 6)}</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="0.001" 
                        step="0.00001" 
                        value={systemParams.noise} 
                        onChange={(e) => onParamChange('noise', parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderRange}>
                        <span>0</span>
                        <span>0.001</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.sliderContainer}>
                    <label className={styles.sliderLabel}>
                      <span>Points Per Frame: {systemParams.pointsPerFrame || 1}</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="1" 
                        value={systemParams.pointsPerFrame || 1} 
                        onChange={(e) => onParamChange('pointsPerFrame', parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderRange}>
                        <span>1</span>
                        <span>5</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Parameter Presets:</div>
                  <div className={styles.presetButtons}>
                    <button 
                      className={styles.presetButton}
                      onClick={() => {
                        onParamChange('sigma', 10);
                        onParamChange('rho', 28);
                        onParamChange('beta', 8/3);
                        onParamChange('dt', 0.004);
                        onParamChange('noise', 0.00005);
                        onParamChange('pointsPerFrame', 2);
                      }}
                    >
                      Classic
                    </button>
                    <button 
                      className={styles.presetButton}
                      onClick={() => {
                        onParamChange('sigma', 14);
                        onParamChange('rho', 45);
                        onParamChange('beta', 3);
                        onParamChange('dt', 0.002);
                        onParamChange('noise', 0.0001);
                        onParamChange('pointsPerFrame', 1);
                      }}
                    >
                      High Energy
                    </button>
                    <button 
                      className={styles.presetButton}
                      onClick={() => {
                        onParamChange('sigma', 5);
                        onParamChange('rho', 15);
                        onParamChange('beta', 2);
                        onParamChange('dt', 0.005);
                        onParamChange('noise', 0.0002);
                        onParamChange('pointsPerFrame', 2);
                      }}
                    >
                      Gentle Flow
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // View mode - show parameter values
              <>
                <div className={styles.paramGrid}>
                  <div className={styles.paramLabel}>σ (sigma):</div>
                  <div className={styles.paramValue}>{formatNumber(systemParams.sigma, 2)}</div>
                  <div className={styles.paramDescription}>Controls fluid viscosity and mixing rate</div>
                  
                  <div className={styles.paramLabel}>ρ (rho):</div>
                  <div className={styles.paramValue}>{formatNumber(systemParams.rho, 2)}</div>
                  <div className={styles.paramDescription}>Energy input - values above 24.74 create chaos</div>
                  
                  <div className={styles.paramLabel}>β (beta):</div>
                  <div className={styles.paramValue}>{formatNumber(systemParams.beta, 2)}</div>
                  <div className={styles.paramDescription}>Affects shape of the attractor</div>
                  
                  <div className={styles.paramLabel}>dt:</div>
                  <div className={styles.paramValue}>{formatNumber(systemParams.dt, 4)}</div>
                  <div className={styles.paramDescription}>Time step size for integration</div>
                  
                  <div className={styles.paramLabel}>noise:</div>
                  <div className={styles.paramValue}>{formatNumber(systemParams.noise, 6)}</div>
                  <div className={styles.paramDescription}>Random fluctuation magnitude</div>
                  
                  <div className={styles.paramLabel}>points/frame:</div>
                  <div className={styles.paramValue}>{systemParams.pointsPerFrame || 1}</div>
                  <div className={styles.paramDescription}>Animation speed - points calculated per frame</div>
                </div>
                
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Parameter Effects:</div>
                  <ul className={styles.effectsList}>
                    <li>
                      <strong>σ (sigma):</strong> Higher values create more turbulence and faster mixing
                    </li>
                    <li>
                      <strong>ρ (rho):</strong> The critical value of 24.74 is a bifurcation point
                    </li>
                    <li>
                      <strong>β (beta):</strong> Typically set to 8/3 for the classic butterfly shape
                    </li>
                    <li>
                      <strong>dt:</strong> Smaller values give more accurate but slower simulation
                    </li>
                    <li>
                      <strong>noise:</strong> Adds small random fluctuations, mimicking real systems
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        );
      
      case 'data':
        return (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Current Position:</div>
              <div className={styles.dataGrid}>
                <div>x:</div>
                <div className={styles.dataValue}>{formatNumber(currentPoint.x, 4)}</div>
                <div>y:</div>
                <div className={styles.dataValue}>{formatNumber(currentPoint.y, 4)}</div>
                <div>z:</div>
                <div className={styles.dataValue}>{formatNumber(currentPoint.z, 4)}</div>
              </div>
            </div>
            
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Current Rates:</div>
              <div className={styles.dataGrid}>
                <div>dx/dt:</div>
                <div className={styles.dataValue}>{formatNumber(currentRates.dx, 4)}</div>
                <div>dy/dt:</div>
                <div className={styles.dataValue}>{formatNumber(currentRates.dy, 4)}</div>
                <div>dz/dt:</div>
                <div className={styles.dataValue}>{formatNumber(currentRates.dz, 4)}</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
      
      {/* Tab content */}
      {renderTabContent()}
      
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

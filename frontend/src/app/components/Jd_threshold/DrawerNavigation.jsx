import { useState, useRef, useEffect } from 'react';
import JDPage from './page'; // Ensure this path is correct to your JDPage component

const DrawerNavigationJD = ({ selectedJd, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const drawerRef = useRef(null);
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth * 0.6);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    setDrawerWidth(isMaximized ? window.innerWidth * 0.6 : window.innerWidth);
  };

  const handleMouseDown = (e) => {
    if (e.target === document.getElementById('drawer-resize-handle')) {
      setIsDragging(true);
      setStartX(e.clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const diff = e.clientX - startX;
      setDrawerWidth((prevWidth) => Math.max(Math.min(prevWidth + diff, window.innerWidth * 0.95), 300));
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDrawerClick = (e) => {
    e.stopPropagation(); // Prevent clicks inside drawer from closing it
  };

  // Add event listeners for mouse events outside the component
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="fixed top-0 left-0 z-50 bg-gray-800 bg-opacity-50 w-full h-full"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        style={{ width: `${drawerWidth}px` }}
        className="absolute top-0 right-0 h-full bg-white border-l shadow-lg transition-all duration-300"
        onClick={handleDrawerClick}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">
            {selectedJd?.fileName || 'Job Description'}
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMaximize} 
              className="text-blue-500 hover:text-blue-700"
            >
              {isMaximized ? 'Restore' : 'Maximize'}
            </button>
            <button 
              onClick={onClose} 
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              ✕
            </button>
          </div>
        </div>

        <div 
          id="drawer-resize-handle"
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize bg-gray-300 hover:bg-blue-500"
          onMouseDown={handleMouseDown}
        ></div>

        <div className="overflow-auto p-4 h-[calc(100%-64px)]">
          {selectedJd && (
            <JDPage 
              jdId={selectedJd.id} 
              selectedFile={selectedJd.file} 
              jdData={selectedJd}
              onClose={onClose} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerNavigationJD;

import React, { useEffect, useRef, useMemo } from 'react';

const BackgroundEffect = () => {
  const containerRef = useRef(null);
  const layersRef = useRef([]); // To keep track of our 3 parallax layers
  const mousePos = useRef({ x: 0, y: 0 }); // Target mouse position
  const currentPos = useRef({ x: 0, y: 0 }); // Current smoothed position

  // Linear interpolation (lerp) function for smoothing
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  // Generate star layers once
  const starLayers = useMemo(() => {
    const generateLayer = (count, sizeRange) => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * sizeRange.max + sizeRange.min}px`,
        opacity: Math.random() * 0.7 + 0.3,
      }));
    };

    return [
      { id: 'far', stars: generateLayer(80, { min: 0.5, max: 1.2 }), factor: 0.01 },
      { id: 'mid', stars: generateLayer(45, { min: 1.5, max: 2.2 }), factor: 0.02 },
      { id: 'near', stars: generateLayer(15, { min: 2.5, max: 3.5 }), factor: 0.035 },
    ];
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Scale mouse position to range [-0.5, 0.5]
      mousePos.current.x = (e.clientX / window.innerWidth) - 0.5;
      mousePos.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    let animationFrameId;
    const animate = () => {
      // Smoothly update current position towards targeted mouse position
      // Using a lerp amt of 0.05 for a nice, fluid "drag" effect
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.05);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.05);

      // Apply transforms to each layer with their respective parallax factors
      layersRef.current.forEach((layer, idx) => {
        if (layer) {
          const factor = starLayers[idx].factor * 800; // Amplify the movement scale
          const tx = currentPos.current.x * factor;
          const ty = currentPos.current.y * factor;
          layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starLayers]);

  return (
    <div ref={containerRef} className="bg-stars-container">
      {/* Immovable Nebulas (Subtle Contrast) */}
      <div className="nebula nebula-1" style={{ opacity: 0.1 }} />
      <div className="nebula nebula-2" style={{ opacity: 0.15 }} />
      
      {/* 3 Parallax Star Layers */}
      {starLayers.map((layer, index) => (
        <div 
          key={layer.id} 
          ref={(el) => (layersRef.current[index] = el)}
          className="star-layer"
          style={{ 
            pointerEvents: 'none',
            willChange: 'transform' // Tell GPU to expect movement
          }}
        >
          {layer.stars.map((star) => (
            <div 
              key={star.id} 
              className="star" 
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                backgroundColor: star.size > 2.5 ? '#fff' : '#e2e8f0',
                boxShadow: star.size > 2.5 ? '0 0 10px rgba(255,255,255,0.4)' : 'none'
              }} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BackgroundEffect;

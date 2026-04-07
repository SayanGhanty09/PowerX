import React, { useEffect, useRef, useMemo } from 'react';

const BackgroundEffect = () => {
  const ringsRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Linear interpolation (lerp) for smooth mouse reaction
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  // Matrix Binary Stream (Green Bits)
  const dataBits = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    opacity: 0.05 + Math.random() * 0.3
  })), []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) - 0.5;
      mousePos.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    let animationFrameId;
    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.08);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.08);

      ringsRef.current.forEach((ring, idx) => {
        if (ring) {
          const factor = (idx + 1) * 35;
          const tx = currentPos.current.x * factor;
          const ty = currentPos.current.y * factor;
          const rotation = (idx % 2 === 0 ? 1 : -1) * (Date.now() / 3500) * (idx + 1);
          ring.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rotation}deg)`;
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
  }, []);

  return (
    <div className="bg-mecha-container">
      {/* CAD Grid System (Hacker Green) */}
      <div className="cad-grid" />
      
      {/* HUD Scanlines */}
      <div className="move-scanline" />
      <div className="scanner-beam" />

      {/* Matrix Binary Stream (Data Bits) */}
      {dataBits.map(bit => (
        <div 
          key={bit.id} 
          className="data-bit" 
          style={{ 
            left: bit.left, 
            animationDelay: bit.delay,
            animationDuration: bit.duration,
            opacity: bit.opacity
          }} 
        />
      ))}

      {/* Hacker HUD Rings (Pure Green) */}
      {[450, 650, 850].map((size, index) => (
        <div
          key={index}
          ref={el => ringsRef.current[index] = el}
          style={{
            position: 'absolute',
            top: 'calc(50% - ' + (size/2) + 'px)',
            left: 'calc(50% - ' + (size/2) + 'px)',
            width: size + 'px',
            height: size + 'px',
            border: (index === 1 ? '2px' : '1px') + ' dashed rgba(0, 255, 65, ' + (0.12 - index * 0.03) + ')',
            borderRadius: '50%',
            pointerEvents: 'none',
            willChange: 'transform',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: index === 0 ? 'inset 0 0 40px rgba(0, 255, 65, 0.03)' : 'none'
          }}
        >
          {/* Schematic Crosshair Elements */}
          <div style={{ 
            width: '15px', 
            height: '1px', 
            background: 'var(--cyber-blue)', 
            position: 'absolute', 
            left: '-8px', 
            opacity: 0.4 
          }} />
          <div style={{ 
            width: '1px', 
            height: '15px', 
            background: 'var(--cyber-blue)', 
            position: 'absolute', 
            top: '-8px', 
            opacity: 0.4 
          }} />
        </div>
      ))}

      {/* CRT Phospors Grain Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
        opacity: 0.1,
        mixBlendMode: 'overlay',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default BackgroundEffect;

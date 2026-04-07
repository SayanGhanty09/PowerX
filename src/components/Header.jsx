import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Radio, Clock, Server } from 'lucide-react';

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <header className="header-glass card" style={{ 
      gridColumn: '1 / -1', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem',
      marginBottom: '1rem',
      borderRadius: '1.25rem'
    }}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="logo-pulse" style={{ 
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
        }}>
          <Server size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Smart Appliance Monitor</h1>
          <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            IoT Control Hub
          </p>
        </div>
      </div>

      <div className="status-indicators" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className={`indicator ${isConnected ? 'indicator-active' : ''}`} style={{ color: isConnected ? 'var(--status-normal)' : 'var(--status-fault)' }}>
            {isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {isConnected ?'Cloud Connected' : 'Disconnected'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="indicator indicator-active" style={{ color: 'var(--status-normal)' }}>
            <Radio size={18} />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>RF Receiver: Active</span>
        </div>

        <div className="divider" style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
          <Clock size={18} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatTime(time)}</span>
            <span style={{ fontSize: '0.7rem' }}>{formatDate(time)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

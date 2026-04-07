import React from 'react';
import { Activity, Cpu, AlertTriangle, Zap, Shield } from 'lucide-react';

const SummaryCard = ({ icon: Icon, title, value, description, index }) => {
  return (
    <div className="mecha-panel" style={{ 
      flex: '1 1 240px', 
      minWidth: '220px', 
      padding: '1.25rem', 
      background: 'var(--bg-panel-dark)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderLeft: '4px solid var(--cyber-blue)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ 
          background: 'rgba(0, 255, 65, 0.08)', 
          padding: '0.6rem', 
          color: 'var(--cyber-blue)',
          border: '1px solid rgba(0, 255, 65, 0.2)',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)'
        }}>
          <Icon size={22} />
        </div>
        <div className="telemetry-text" style={{ fontSize: '0.6rem', opacity: 0.6 }}>
           LIVE_DAT
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 className="telemetry-text" style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginBottom: '0.35rem', color: '#fff' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span className="value-prominent" style={{ fontSize: '2.2rem', color: '#fff', textShadow: 'var(--text-glow)' }}>{value}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: 'auto' }}>
        <div style={{ height: '3px', flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '0', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: '75%', 
            background: 'var(--cyber-blue)',
            boxShadow: '0 0 8px var(--cyber-blue-glow)' 
          }}></div>
        </div>
        <span className="telemetry-text" style={{ fontSize: '0.6rem', opacity: 0.8 }}>75%_SYNC</span>
      </div>
    </div>
  );
};

const SummaryCards = ({ data }) => {
  const stats = [
    {
      icon: Cpu,
      title: 'MECHA_NODES',
      value: data.total || 0,
    },
    {
      icon: Shield,
      title: 'SYS_HEALTH',
      value: data.healthy || 0,
    },
    {
      icon: AlertTriangle,
      title: 'INTERRUPTS',
      value: data.faulty || 0,
    },
    {
      icon: Zap,
      title: 'NET_AMP_DRAW',
      value: `${data.totalCurrent || 0}A`,
    }
  ];

  return (
    <div className="stats-grid" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
      {stats.map((stat, index) => (
        <SummaryCard key={index} index={index} {...stat} />
      ))}
    </div>
  );
};

export default SummaryCards;

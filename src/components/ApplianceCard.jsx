import React from 'react';
import { Power, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const ApplianceCard = ({ appliance }) => {
  const { name, status, current, lastUpdated } = appliance;

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'NORMAL': return 'var(--status-normal)';
      case 'WARNING': return 'var(--status-warning)';
      case 'FAULT': return 'var(--status-fault)';
      default: return 'var(--text-dim)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toUpperCase()) {
      case 'NORMAL': return <CheckCircle size={18} />;
      case 'WARNING': return <AlertTriangle size={18} />;
      case 'FAULT': return <AlertTriangle size={18} />;
      default: return <Power size={18} />;
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <div className="glass-panel card-hover" style={{ 
      padding: '1.5rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.25rem', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Glow Accent */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '4px', 
        height: '100%', 
        background: statusColor,
        boxShadow: `0 0 15px ${statusColor}`
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff' }}>{name}</h4>
        <div style={{ color: statusColor, filter: `drop-shadow(0 0 5px ${statusColor})` }}>
          {getStatusIcon(status)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          padding: '0.8rem', 
          borderRadius: '0.75rem',
          color: 'var(--accent-primary)',
          boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.1)'
        }}>
          <Zap size={22} fill="var(--accent-primary)" />
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Load</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
             <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#fff' }}>{current}</p>
             <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dim)' }}>Amps</span>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <span className={`badge badge-${status.toLowerCase()}`}>
          {status}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>
          Updated: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ApplianceCard;

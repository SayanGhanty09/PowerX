import React from 'react';
import { Power, AlertTriangle, CheckCircle, Zap, Terminal } from 'lucide-react';

const ApplianceCard = ({ appliance }) => {
  const { name, status, current, lastUpdated, id } = appliance;

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'NORMAL': return 'var(--cyber-blue)';
      case 'WARNING': return 'var(--alert-orange)';
      case 'FAULT': return '#ff4444';
      default: return '#94a3b8';
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <div className="mecha-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '320px' }}>
      {/* HUD Accent Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '0.7rem', color: statusColor, fontWeight: 800 }}>[UNIT_ID: 0{id}]</span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.25rem 0 0 0', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff' }}>{name}</h4>
        </div>
        <div style={{ color: statusColor, filter: 'drop-shadow(0 0 5px var(--cyber-blue-glow))' }}>
          <Terminal size={22} />
        </div>
      </div>

      {/* Main Telemetry Display */}
      <div style={{ 
        background: 'rgba(0,0,0,0.4)', 
        padding: '1.75rem', 
        border: '1px solid var(--gunmetal)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        <div style={{ 
          color: statusColor, 
          background: `rgba(${statusColor === 'var(--cyber-blue)' ? '0, 242, 255' : '255, 157, 0'}, 0.08)`,
          padding: '1rem',
          clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
          border: `1px solid ${statusColor}33`
        }}>
          <Zap size={28} fill={statusColor} />
        </div>
        <div>
          <p className="telemetry-text" style={{ marginBottom: '0.4rem', fontSize: '0.7rem', opacity: 0.8 }}>LOAD_INTAKE</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
             <p style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-mono)', color: '#fff', textShadow: `0 0 10px ${statusColor}33` }}>{current}</p>
             <span style={{ fontSize: '1rem', fontWeight: 800, color: statusColor }}>AMP</span>
          </div>
        </div>
        
        {/* Right Corner Accent */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '12px', height: '12px', borderRight: '2px solid var(--gunmetal)', borderTop: '2px solid var(--gunmetal)' }} />
      </div>

      {/* Footer / Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
           <span className="telemetry-text" style={{ 
             color: statusColor, 
             background: 'rgba(255,255,255,0.03)', 
             padding: '0.4rem 0.8rem', 
             border: `1px solid ${statusColor}`,
             fontSize: '0.75rem',
             fontWeight: 900,
             boxShadow: `0 0 10px ${statusColor}33`
           }}>
             {status}
           </span>
        </div>
        
        <div className="telemetry-text" style={{ fontSize: '0.65rem', textAlign: 'right', color: 'var(--text-dim)' }}>
           LC_UPDT:<br/>
           <span style={{ color: '#fff' }}>{new Date(lastUpdated).toLocaleTimeString([], { hour12: false })}</span>
        </div>
      </div>
    </div>
  );
};

export default ApplianceCard;

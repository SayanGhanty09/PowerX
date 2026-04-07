import React from 'react';
import { AlertTriangle, MapPin, Trash2, Bell, ShieldAlert, Activity } from 'lucide-react';

const FaultAlert = ({ alert }) => {
  const { timestamp, type, location } = alert;

  return (
    <div style={{ 
      padding: '1.5rem', 
      background: 'rgba(255, 68, 68, 0.08)', 
      borderLeft: '6px solid #ff4444',
      marginBottom: '1.25rem',
      clipPath: 'polygon(0 0, 100% 0, 94% 100%, 0 100%)',
      border: '1px solid rgba(255, 68, 68, 0.2)',
      boxShadow: '0 0 15px rgba(255, 68, 68, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ff4444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>[EVENT: {type}]</h5>
        <span className="telemetry-text" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{timestamp}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        <MapPin size={14} color="#ff4444" />
        <span className="telemetry-text" style={{ fontWeight: 700 }}>NODE_LOC: {location}</span>
      </div>
    </div>
  );
};

const FaultPanel = ({ alerts }) => {
  return (
    <div className="mecha-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldAlert size={32} color="var(--alert-orange)" style={{ filter: 'drop-shadow(0 0 8px var(--alert-orange-glow))' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 900, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>INCIDENT_TRACKER</h3>
        </div>
        {alerts.length > 0 && (
          <div className="telemetry-text" style={{ color: '#ff4444', fontWeight: 900, background: 'rgba(255, 68, 68, 0.1)', padding: '0.4rem 0.8rem', border: '1px solid #ff4444', fontSize: '0.8rem' }}>
             {alerts.length} UNRESOLVED
          </div>
        )}
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        maxHeight: '480px',
        paddingRight: '1rem'
      }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--gunmetal)' }}>
            <Activity size={48} style={{ marginBottom: '2rem', opacity: 0.2 }} />
            <p className="telemetry-text" style={{ fontSize: '0.85rem', fontWeight: 800 }}>ALL_SYSTEMS_GO // NO_INTERRUPTS</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <FaultAlert key={alert.id} alert={alert} />
          ))
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        paddingTop: '2rem', 
        borderTop: '2px solid var(--gunmetal)',
        textAlign: 'center'
      }}>
        <button className="telemetry-text" style={{ 
          background: 'var(--bg-main)', 
          border: '2px solid var(--gunmetal)', 
          color: '#fff', 
          fontSize: '0.85rem',
          padding: '0.8rem 1.75rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          margin: '0 auto',
          fontWeight: 900,
          clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
          transition: '0.3s all'
        }}>
          <Trash2 size={18} /> PURGE_HUD_AUDIT
        </button>
      </div>
    </div>
  );
};

export default FaultPanel;

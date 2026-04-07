import React from 'react';
import { AlertTriangle, MapPin, Trash2, Bell } from 'lucide-react';

const FaultAlert = ({ alert }) => {
  const { timestamp, type, location } = alert;

  return (
    <div className="card-hover" style={{ 
      padding: '1rem', 
      background: 'rgba(239, 68, 68, 0.03)', 
      borderLeft: '4px solid var(--status-fault)',
      borderRadius: '1rem',
      marginBottom: '1rem',
      border: '1px solid rgba(239, 68, 68, 0.1)',
      transition: '0.3s all'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-fault)' }}>{type}</h5>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>{timestamp}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        <MapPin size={14} />
        <span>Node: {location}</span>
      </div>
    </div>
  );
};

const FaultPanel = ({ alerts }) => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
             <Bell size={20} color="var(--status-fault)" />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, margin: 0 }}>Incident Feed</h3>
        </div>
        {alerts.length > 0 && (
          <div className="badge badge-fault" style={{ fontSize: '0.65rem' }}>{alerts.length} NEW</div>
        )}
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        maxHeight: '450px',
        paddingRight: '0.75rem',
        scrollbarWidth: 'thin'
      }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
            <AlertTriangle size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem' }}>All systems operational. No active faults detected.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <FaultAlert key={alert.id} alert={alert} />
          ))
        )}
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        paddingTop: '1.5rem', 
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <button style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid var(--border-color)', 
          color: 'white', 
          fontSize: '0.8rem',
          padding: '0.6rem 1.2rem',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '0 auto',
          fontWeight: 600,
          transition: '0.2s all'
        }}>
          <Trash2 size={16} /> Clear Feed
        </button>
      </div>
    </div>
  );
};

export default FaultPanel;

import React from 'react';
import { ListFilter, Info, Database, AlertCircle } from 'lucide-react';

const LogItem = ({ log }) => {
  const { timestamp, type, message } = log;
  
  const getTypeColor = () => {
    switch(type) {
      case 'INFO': return '#3b82f6';
      case 'DATA': return '#10b981';
      case 'ALERT': return '#ef4444';
      default: return 'var(--text-secondary)';
    }
  };

  const Icon = type === 'ALERT' ? AlertCircle : type === 'DATA' ? Database : Info;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: '1rem', 
      padding: '0.75rem 0', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.825rem'
    }}>
      <span style={{ color: 'var(--text-secondary)', minWidth: '70px', fontWeight: 500 }}>[{timestamp}]</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getTypeColor(), minWidth: '60px', fontWeight: 600 }}>
        <Icon size={14} />
        <span>{type}</span>
      </div>
      <span style={{ color: 'var(--text-primary)' }}>{message}</span>
    </div>
  );
};

const LogsSection = ({ logs, lastSync }) => {
  return (
    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
      {/* Cloud Sync Status */}
      <div className="card" style={{ gridColumn: '1 / 4', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '50%', 
          color: '#3b82f6',
          marginBottom: '1rem',
          position: 'relative'
        }}>
          <Database size={32} />
          <div className="indicator indicator-active" style={{ position: 'absolute', bottom: '15px', right: '15px', color: '#10b981' }}></div>
        </div>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Cloud Sync Status</h3>
        <p className="text-secondary" style={{ fontSize: '0.825rem', marginBottom: '1.25rem' }}>Consentium IoT Infrastructure</p>
        
        <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Last Sync</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{lastSync}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Status</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Data Synced</span>
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div className="card" style={{ gridColumn: '4 / -1', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ListFilter size={20} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>System Event Logs</h3>
          </div>
          <div className="badge badge-normal" style={{ cursor: 'pointer' }}>Download CSV</div>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          maxHeight: '200px',
          paddingRight: '0.5rem'
        }}>
          {logs.map((log, index) => (
            <LogItem key={index} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsSection;

import React from 'react';
import { 
  History, 
  Search, 
  Database, 
  Server,
  AlertCircle,
  FileText,
  Trash2,
  Terminal,
  Activity
} from 'lucide-react';
import LogsSection from '../components/LogsSection';
import { mockLogs } from '../services/api';

const LogsPage = () => {
  return (
    <div className="page-container mecha-fadeIn">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', opacity: 0.8 }}>[ DEPT: SYSTEM_AUDIT_PROTOCOL_v4.2 ]</span>
          <h1 className="page-title">EVENT_LOG_AUDIT</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="telemetry-text" style={{ 
            padding: '0.6rem 1.4rem', 
            background: 'rgba(255, 68, 68, 0.08)', 
            border: '2px solid rgba(255, 68, 68, 0.3)', 
            color: '#ff4444', 
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.8rem',
            boxShadow: '0 0 15px rgba(255, 68, 68, 0.15)',
            transition: '0.3s all'
          }}>
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} /> PURGE_AUDIT
          </button>
        </div>
      </header>

      {/* Connection Stats Grid - Compacted */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="mecha-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(0, 242, 255, 0.08)', padding: '0.75rem', color: 'var(--cyber-blue)', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
            <Server size={22} />
          </div>
          <div>
            <p className="telemetry-text" style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>GATEWAY_LINK</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '0.04em', color: '#fff' }}>OPERATIONAL</p>
          </div>
        </div>
        <div className="mecha-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(0, 242, 255, 0.08)', padding: '0.75rem', color: 'var(--cyber-blue)', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
            <Database size={22} />
          </div>
          <div>
            <p className="telemetry-text" style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>DB_PERSISTENCE</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '0.04em', color: '#fff' }}>SYNC_LOCKED</p>
          </div>
        </div>
        <div className="mecha-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255, 157, 0, 0.08)', padding: '0.75rem', color: 'var(--alert-orange)', border: '1px solid rgba(255, 157, 0, 0.2)' }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="telemetry-text" style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>ERR_INTERRUPTS</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '0.04em', color: 'var(--alert-orange)' }}>04_ACTIVE</p>
          </div>
        </div>
      </div>

      {/* Main Logs View */}
      <LogsSection logs={mockLogs} lastSync="12:47:00" />

      {/* Search HUD - Scaled Down */}
      <div className="mecha-panel" style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-panel-dark)', borderLeft: '8px solid var(--cyber-blue)' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Terminal size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gunmetal)' }} />
            <input 
              type="text" 
              placeholder="QUERY_CORE_LOGS..." 
              style={{ 
                width: '100%', 
                padding: '1rem 1.5rem 1rem 3.75rem', 
                background: 'var(--bg-main)', 
                border: '1px solid var(--gunmetal)', 
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
            />
          </div>
          <button className="telemetry-text" style={{ 
            padding: '0.8rem 2rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '2px solid var(--gunmetal)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.85rem', 
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.85rem',
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
            transition: '0.3s all'
          }}>
            <FileText size={18} /> EXPORT_AUDIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;

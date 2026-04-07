import React from 'react';
import { 
  History, 
  Search, 
  Database, 
  Server,
  AlertCircle,
  FileText,
  Trash2
} from 'lucide-react';
import LogsSection from '../components/LogsSection';
import { mockLogs } from '../services/api';

const LogsPage = () => {
  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">System Event Logs</h1>
          <p className="text-dim">Audit trail of all appliance status changes, cloud sync events, and fault alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass-panel" style={{ 
            padding: '0.75rem 1.25rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: 'var(--status-fault)', 
            borderRadius: '0.75rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <Trash2 size={18} /> Clear Logs
          </button>
        </div>
      </header>

      {/* Connection Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
            <Server size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Gateway Status</p>
            <p style={{ fontSize: '1rem', fontWeight: 700 }}>Operational</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--status-normal)' }}>
            <Database size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DB Persistence</p>
            <p style={{ fontSize: '1rem', fontWeight: 700 }}>Synced</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--status-warning)' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Recent Warnings</p>
            <p style={{ fontSize: '1rem', fontWeight: 700 }}>4 Active</p>
          </div>
        </div>
      </div>

      {/* Main Logs View */}
      <LogsSection logs={mockLogs} lastSync="12:47:00" />

      {/* Log Search/Filter */}
      <div className="card glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              placeholder="Search logs by keyword or appliance ID..." 
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem 0.75rem 3rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '0.75rem',
                color: 'white',
                outline: 'none'
              }} 
            />
          </div>
          <button className="glass-panel" style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <FileText size={18} /> Daily Report
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LogsPage;

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCcw,
  Cpu,
  Terminal,
  Database,
  Grid
} from 'lucide-react';
import ApplianceCard from '../components/ApplianceCard';
import apiService from '../services/api';

const AppliancesPage = () => {
  const [appliances, setAppliances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAppliances();
    const interval = setInterval(fetchAppliances, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppliances = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiService.fetchApplianceData();
      setAppliances(data);
    } catch (ignore) {}
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredAppliances = appliances.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status.toUpperCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container mecha-fadeIn">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '3rem' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>[ DEPT: SYSTEM_NODE_REGISTRY_v4.2 ]</span>
          <h1 className="page-title">MECHA_FLEET</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={fetchAppliances}
            className={`badge-mecha ${isRefreshing ? 'refresh-spin' : ''}`}
            style={{ 
              background: 'rgba(0, 242, 255, 0.05)', 
              color: 'var(--cyber-blue)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              border: '1px solid var(--cyber-blue)',
              boxShadow: '0 0 15px var(--cyber-blue-glow)',
              fontWeight: 800,
              clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)'
            }}
          >
            <RefreshCcw size={16} /> REFRESH_NODES
          </button>
        </div>
      </header>

      {/* Control Interface Panel */}
      <div className="mecha-panel" style={{ 
        padding: '1.75rem 2.5rem', 
        marginBottom: '3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'var(--bg-panel-dark)',
        borderBottom: '4px solid var(--cyber-blue)'
      }}>
        <div style={{ position: 'relative', width: '500px' }}>
          <Terminal size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gunmetal)' }} />
          <input 
            type="text" 
            placeholder="QUERY_UNIT_PROTOCOL..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'var(--bg-main)', 
              border: '1px solid var(--gunmetal)', 
              borderRadius: '0', 
              padding: '1rem 1rem 1rem 3.5rem',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['ALL', 'NORMAL', 'WARNING', 'FAULT'].map((status) => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className="telemetry-text"
                style={{ 
                  background: filterStatus === status ? 'var(--cyber-blue)' : 'transparent',
                  color: filterStatus === status ? 'var(--bg-main)' : 'var(--gunmetal)',
                  border: filterStatus === status ? 'none' : '1px solid var(--gunmetal)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: '0.2s all'
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <div style={{ width: '2px', height: '30px', background: 'var(--gunmetal)' }} />
          <div className="telemetry-text" style={{ fontSize: '0.85rem' }}>
             <Database size={16} style={{ marginRight: '0.5rem', color: 'var(--cyber-blue)' }} /> NODE_COUNT: {filteredAppliances.length}
          </div>
        </div>
      </div>

      {/* Grid Topology */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
        gap: '2rem', 
        paddingBottom: '4rem' 
      }}>
        {filteredAppliances.map((app) => (
          <ApplianceCard key={app.id} appliance={app} />
        ))}
      </div>

      {filteredAppliances.length === 0 && (
        <div style={{ textAlign: 'center', padding: '8rem', color: 'var(--gunmetal)' }}>
          <Grid size={80} style={{ marginBottom: '2rem', opacity: 0.1 }} />
          <h2 className="telemetry-text" style={{ fontSize: '1.5rem' }}>ERR_NO_ACTIVE_SECTOR_NODES</h2>
          <p className="telemetry-text" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>Verify network connection and Consentium_IoT uplink status.</p>
        </div>
      )}

      <style>{`
        .refresh-spin svg { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AppliancesPage;

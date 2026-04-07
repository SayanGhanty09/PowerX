import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  RefreshCcw,
  LayoutGrid,
  List
} from 'lucide-react';
import ApplianceCard from '../components/ApplianceCard';
import apiService from '../services/api';

const AppliancesPage = () => {
  const [appliances, setAppliances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiService.fetchApplianceData();
      setAppliances(data);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppliances = appliances.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || app.status.toUpperCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Appliance Fleet</h1>
          <p className="text-dim">Manage & monitor individual appliance status and real-time load.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass-panel" style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'var(--accent-primary)', 
            border: 'none', 
            color: 'white', 
            borderRadius: '0.75rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
          }}>
            <Plus size={18} /> Add Device
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="glass-panel" style={{ 
        padding: '1rem', 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(30, 41, 59, 0.3)'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
          <div style={{ position: 'relative', flex: 0.5 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              placeholder="Search by appliance name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'NORMAL', 'WARNING', 'FAULT'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid var(--border-color)',
                  background: filter === f ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-dim)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: '0.2s all'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1.5rem' }}>
          <button className="glass-panel" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}><LayoutGrid size={18} /></button>
          <button className="glass-panel" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}><List size={18} /></button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredAppliances.map((app) => (
          <ApplianceCard key={app.id} appliance={app} />
        ))}
        {filteredAppliances.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <p style={{ fontSize: '1.1rem' }}>No appliances found matching your criteria.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AppliancesPage;

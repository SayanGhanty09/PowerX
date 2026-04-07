import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  Wifi, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import FaultPanel from '../components/FaultPanel';
import apiService, { mockAlerts } from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, healthy: 0, faulty: 0, totalCurrent: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const fetchData = async () => {
      const data = await apiService.fetchApplianceData();
      const healthy = data.filter(a => a.status === 'NORMAL').length;
      const faulty = data.filter(a => a.status === 'FAULT').length;
      const totalCurrent = data.reduce((sum, a) => sum + parseFloat(a.current), 0).toFixed(1);
      setStats({ total: data.length, healthy, faulty, totalCurrent });
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => { clearInterval(timer); clearInterval(interval); };
  }, []);

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">System Overview</h1>
          <p className="text-dim">Real-time health monitoring & diagnostics for Smart Appliances.</p>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', color: 'var(--text-primary)' }}>
            <Clock size={16} />
            <span style={{ fontWeight: 600 }}>{currentTime.toLocaleTimeString()}</span>
          </div>
          <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </header>

      <SummaryCards data={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Main Insight Section */}
        <div className="card glass-panel" style={{ gridColumn: '1 / 9', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Network Performance</h3>
            <div className="badge badge-normal">Healthy</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Cloud Latency</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>42ms</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--status-normal)', display: 'flex', alignItems: 'center' }}>
                  <ArrowDownRight size={14} /> 12%
                </span>
              </div>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Uptime Rate</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>99.9%</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--status-normal)', display: 'flex', alignItems: 'center' }}>
                  <ArrowUpRight size={14} /> 0.1%
                </span>
              </div>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Sync Freq</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>5.0s</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Static</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Wifi size={24} color="white" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Consentium IoT Infrastructure</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Connected via Secure Gateway Node. Latency optimized for ESP32 modules.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div style={{ gridColumn: '9 / -1' }}>
          <FaultPanel alerts={mockAlerts} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DashboardPage;

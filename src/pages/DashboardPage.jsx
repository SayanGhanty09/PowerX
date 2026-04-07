import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Monitor, 
  Terminal,
  Zap,
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
    <div className="page-container mecha-fadeIn">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', opacity: 0.8 }}>[ DEPT: CENTRAL_MAINFRAME_v4.2 ]</span>
          <h1 className="page-title">SYSTEM_CORE</h1>
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.15rem' }}>
             <div className="telemetry-text" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--alert-orange)' }}>
                <Monitor size={10} /> HOST_STATUS_UP
             </div>
             <div className="telemetry-text" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Activity size={10} /> KERNEL_STABLE
             </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cyber-blue)', textShadow: 'var(--text-glow)', fontFamily: 'var(--font-mono)' }}>
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <span className="telemetry-text" style={{ color: 'var(--text-dim)', letterSpacing: '0.15em', fontSize: '0.65rem' }}>SYNC_REALTIME</span>
        </div>
      </header>

      <SummaryCards data={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem', marginTop: '1.5rem' }}>
        {/* Dynamic Telemetry Panel - Rescaled */}
        <div className="mecha-panel" style={{ gridColumn: '1 / 9', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div style={{ borderLeft: '3px solid var(--cyber-blue)', paddingLeft: '0.6rem' }}>
               <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff' }}>TELEMETRY_ENGINE</h3>
               <p className="telemetry-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>SRC: INDUSTRIAL_ESP32</p>
            </div>
            <div className="telemetry-text" style={{ color: 'var(--cyber-blue)', border: '1px solid rgba(0, 242, 255, 0.3)', padding: '0.35rem 0.7rem', fontSize: '0.6rem' }}>AUTO_CAL_ON</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-industrial)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '2px', background: 'var(--cyber-blue)' }} />
              <p className="telemetry-text" style={{ marginBottom: '0.5rem', fontSize: '0.55rem', opacity: 0.8 }}>MSEC_LATENCY</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                <span className="value-prominent" style={{ fontSize: '1.8rem' }}>0.4</span>
                <span className="telemetry-text" style={{ fontSize: '0.7rem', color: '#10b981' }}>-12%</span>
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-industrial)' }}>
              <p className="telemetry-text" style={{ marginBottom: '0.5rem', fontSize: '0.55rem', opacity: 0.8 }}>UP_INTEGRITY</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                <span className="value-prominent" style={{ fontSize: '1.8rem' }}>99.9</span>
                <span className="telemetry-text" style={{ fontSize: '0.7rem', color: 'var(--cyber-blue)' }}>STABIL</span>
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-industrial)' }}>
              <p className="telemetry-text" style={{ marginBottom: '0.5rem', fontSize: '0.55rem', opacity: 0.8 }}>SYNC_CYC</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                <span className="value-prominent" style={{ fontSize: '1.8rem' }}>5.0</span>
                <span className="telemetry-text" style={{ fontSize: '0.7rem' }}>SEC</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', border: '1px solid rgba(0, 242, 255, 0.2)', background: 'rgba(0, 242, 255, 0.04)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(to bottom, var(--cyber-blue), transparent)' }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Terminal size={24} color="var(--cyber-blue)" style={{ filter: 'drop-shadow(0 0 6px var(--cyber-blue-glow))', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '0.1rem' }}>MECHA_SEC_HANDSHAKE</h4>
                  <p className="telemetry-text" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', lineHeight: '1.3', textTransform: 'none' }}>RSA_2048 Cryptography Verified. CID: CYB-P42. Active.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Real-time Alerts - Compacted */}
        <div style={{ gridColumn: '9 / -1' }}>
          <FaultPanel alerts={mockAlerts} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

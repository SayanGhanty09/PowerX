import React from 'react';
import { 
  Download,
  Zap,
  Activity,
  ShieldCheck,
  Terminal,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Tooltip
} from 'recharts';
import ChartsSection from '../components/ChartsSection';
import { mockHistory, mockBarData } from '../services/api';

const AnalyticsPage = () => {
  // Mock data for mini sparklines
  const avgPowerData = [
    { v: 22 }, { v: 25 }, { v: 23 }, { v: 26 }, { v: 24 }, { v: 25 }, { v: 24.2 }
  ];

  const resolutionData = [
    { name: 'Resolved', value: 92, color: '#10b981' },
    { name: 'Pending', value: 8, color: 'var(--gunmetal)' }
  ];

  return (
    <div className="page-container mecha-fadeIn">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '3rem' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>[ DEPT: DATA_PROCESSING_CORE_v4.2 ]</span>
          <h1 className="page-title">TELEMETRY_DAT</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="telemetry-text" style={{ 
            padding: '1rem 2rem', 
            background: 'var(--cyber-blue)', 
            border: 'none', 
            color: 'var(--bg-main)', 
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
            cursor: 'pointer',
            fontWeight: 900,
            fontSize: '1rem',
            boxShadow: '0 0 20px var(--cyber-blue-glow)'
          }}>
            <Download size={20} style={{ marginRight: '0.75rem' }} /> EXPORT_INTEL
          </button>
        </div>
      </header>

      {/* Visual Analytics Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
        
        {/* Avg. Power Consumption - Sparkline */}
        <div className="mecha-panel" style={{ padding: '2rem', height: '220px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <p className="telemetry-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>AVG_PWR_LOAD</p>
              <h2 className="value-prominent" style={{ fontSize: '2.5rem' }}>24.2<span style={{ fontSize: '1rem', color: 'var(--cyber-blue)', marginLeft: '0.5rem' }}>AMP</span></h2>
            </div>
            <div style={{ color: 'var(--cyber-blue)', filter: 'drop-shadow(0 0 8px var(--cyber-blue-glow))' }}>
              <Zap size={24} fill="var(--cyber-blue)" />
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={avgPowerData}>
                <Area 
                  type="stepAfter" 
                  dataKey="v" 
                  stroke="var(--cyber-blue)" 
                  fill="rgba(0, 242, 255, 0.15)" 
                  strokeWidth={3}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Load Recorded - Pictorial Indicator */}
        <div className="mecha-panel" style={{ padding: '2rem', height: '220px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="telemetry-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>PEAK_THRESHOLD</p>
              <h2 className="value-prominent" style={{ fontSize: '2.5rem', color: 'var(--alert-orange)' }}>38.5<span style={{ fontSize: '1rem', color: 'var(--alert-orange)', marginLeft: '0.5rem' }}>AMP</span></h2>
            </div>
            <div style={{ color: 'var(--alert-orange)', filter: 'drop-shadow(0 0 8px var(--alert-orange-glow))' }}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ height: '12px', width: '100%', background: 'var(--bg-main)', border: '1px solid var(--gunmetal)', position: 'relative' }}>
              <div style={{ 
                height: '100%', 
                width: '78%', 
                background: 'linear-gradient(to right, var(--cyber-blue), var(--alert-orange))', 
                boxShadow: '0 0 20px var(--alert-orange-glow)'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--gunmetal)', fontWeight: 800 }}>
              <span className="telemetry-text">0_AMP</span>
              <span className="telemetry-text" style={{ color: 'var(--alert-orange)' }}>CRITICAL_LIMIT_50A</span>
            </div>
          </div>
        </div>

        {/* Fault Resolution Rate - Radial Gauge */}
        <div className="mecha-panel" style={{ padding: '2rem', height: '220px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '130px', height: '130px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="var(--gunmetal)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              fontSize: '1.8rem', 
              fontWeight: 900,
              color: '#10b981',
              fontFamily: 'var(--font-mono)',
              textShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
            }}>92%</div>
          </div>
          <div>
            <p className="telemetry-text" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>RESOLUTION_EFF</p>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', fontWeight: 800 }}>Kernel_Stable</h4>
            <p className="telemetry-text" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>28/30 SYS_ERR_CLR</p>
          </div>
        </div>

      </div>

      <ChartsSection lineData={mockHistory} barData={mockBarData} />

      {/* Advanced Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', marginTop: '2.5rem' }}>
        <div className="mecha-panel" style={{ gridColumn: '1 / 7', padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.25rem', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)', filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.2))' }}>
            <Terminal size={40} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', textTransform: 'uppercase' }}>Stability_Score</h3>
            <p className="telemetry-text" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>System-wide signal integrity verified at 98.4% freq. No jitter detected.</p>
          </div>
        </div>
        <div className="mecha-panel" style={{ gridColumn: '7 / -1', padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '1.25rem', color: 'var(--cyber-blue)', border: '1px solid rgba(0, 242, 255, 0.3)', filter: 'drop-shadow(0 0 10px var(--cyber-blue-glow))' }}>
            <ShieldCheck size={40} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', textTransform: 'uppercase' }}>MECHA_SEC_STAKE</h3>
            <p className="telemetry-text" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>Consentium_IoT RSA encrypted handshake active. No unauthorized logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

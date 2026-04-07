import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle
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
    { name: 'Resolved', value: 92, color: 'var(--status-normal)' },
    { name: 'Pending', value: 8, color: 'rgba(255,255,255,0.05)' }
  ];

  return (
    <div className="page-container fadeIn">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Advanced Analytics</h1>
          <p className="text-dim">Pictorial breakdown of power performance and fault resolution.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass-panel" style={{ 
            padding: '0.75rem 1.25rem', 
            background: 'var(--accent-primary)', 
            border: 'none', 
            color: 'white', 
            borderRadius: '0.75rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600
          }}>
            <Download size={18} /> Export Intel
          </button>
        </div>
      </header>

      {/* Visual Analytics Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Avg. Power Consumption - Sparkline */}
        <div className="glass-panel card-hover" style={{ padding: '1.5rem', height: '180px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Avg. Power Consumption</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>24.2<span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginLeft: '0.25rem' }}>Amps</span></h2>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--accent-primary)' }}>
              <Zap size={20} fill="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={avgPowerData}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke="var(--accent-primary)" 
                  fillOpacity={1} 
                  fill="url(#colorAvg)" 
                  strokeWidth={2}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Load Recorded - Pictorial Indicator */}
        <div className="glass-panel card-hover" style={{ padding: '1.5rem', height: '180px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Peak Load Recorded</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>38.5<span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginLeft: '0.25rem' }}>Amps</span></h2>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--status-warning)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative' }}>
              <div style={{ 
                height: '100%', 
                width: '78%', 
                background: 'linear-gradient(to right, var(--accent-primary), var(--status-warning))', 
                borderRadius: '4px',
                boxShadow: '0 0 10px var(--status-warning)'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              <span>0A</span>
              <span style={{ color: 'var(--status-warning)' }}>MAX ALERT (50A)</span>
            </div>
          </div>
        </div>

        {/* Fault Resolution Rate - Radial Gauge */}
        <div className="glass-panel card-hover" style={{ padding: '1.5rem', height: '180px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="var(--status-normal)" />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              fontSize: '1.1rem', 
              fontWeight: 800,
              color: 'var(--status-normal)'
            }}>92%</div>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Fault Resolution</p>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>Optimal Health</h4>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)' }}>28/30 issues cleared</p>
          </div>
        </div>

      </div>

      <ChartsSection lineData={mockHistory} barData={mockBarData} />

      {/* Advanced Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="glass-panel" style={{ gridColumn: '1 / 7', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '1rem', color: 'var(--accent-secondary)' }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#fff' }}>Module Stability Score</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>System-wide signal integrity at 98.4% uptime frequency.</p>
          </div>
        </div>
        <div className="glass-panel" style={{ gridColumn: '7 / -1', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem', color: 'var(--status-normal)' }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#fff' }}>Security Compliance</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>Consentium IoT encrypted handshake protocol active.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

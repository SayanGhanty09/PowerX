import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Zap, Terminal, Shield } from 'lucide-react';

const ChartsSection = ({ lineData, barData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'var(--bg-panel-dark)', 
          border: '1px solid var(--cyber-blue)', 
          padding: '0.75rem', 
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          boxShadow: '0 0 15px var(--cyber-blue-glow)'
        }}>
          <p style={{ margin: 0, color: 'var(--cyber-blue)', fontWeight: 700 }}>{`[LOG_ID: ${label}]`}</p>
          <p style={{ margin: 0, color: '#fff' }}>
            {`${payload[0].name}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
      {/* Power Dynamics - Mecha Chart */}
      <div className="mecha-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={22} color="var(--cyber-blue)" />
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700 }}>CORE_LOAD_TELEMETRY</h3>
          </div>
          <span className="telemetry-text" style={{ fontSize: '0.6rem' }}>DATA_SRC: ENCRYPTED_ESP32</span>
        </div>
        
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cyber-blue)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--cyber-blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 242, 255, 0.05)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="var(--gunmetal)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
                fontFamily="var(--font-mono)"
              />
              <YAxis 
                stroke="var(--gunmetal)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
                fontFamily="var(--font-mono)"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--cyber-blue)', strokeWidth: 1 }} />
              <Area 
                type="stepAfter" 
                dataKey="current" 
                name="AMP_FLOW" 
                stroke="var(--cyber-blue)" 
                fillOpacity={1} 
                fill="url(#cyberGradient)" 
                strokeWidth={2}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fault Analytics - Industrial Bar Chart */}
      <div className="mecha-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Terminal size={22} color="var(--alert-orange)" />
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700 }}>ERROR_LOG_DISTRIBUTION</h3>
          </div>
          <span className="telemetry-text" style={{ fontSize: '0.6rem' }}>SYST_MONITOR: ACTIVE</span>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 157, 0, 0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--gunmetal)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                fontFamily="var(--font-mono)"
              />
              <YAxis 
                stroke="var(--gunmetal)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                fontFamily="var(--font-mono)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="faults" name="EVENT_COUNT" radius={[0, 0, 0, 0]} barSize={35}>
                {barData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.faults > 2 ? '#ff4444' : entry.faults > 0 ? 'var(--alert-orange)' : 'var(--gunmetal)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

const ChartsSection = ({ lineData, barData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          padding: '0.75rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
        }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: payload[0].color }}>
            {payload[0].name}: {payload[0].value}{payload[0].unit || ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <TrendingUp size={22} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#fff', fontWeight: 700 }}>Power Dynamics</h3>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="var(--text-dim)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="var(--text-dim)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}A`} 
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="current" 
                name="Total Load" 
                stroke="var(--accent-primary)" 
                strokeWidth={4} 
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <BarChart3 size={22} color="var(--status-warning)" />
          <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#fff', fontWeight: 700 }}>Fault Analytics</h3>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="faults" name="Fault Count" radius={[4, 4, 0, 0]} barSize={40}>
                {barData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.faults > 2 ? 'var(--status-fault)' : entry.faults > 0 ? 'var(--status-warning)' : 'var(--status-normal)'} 
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

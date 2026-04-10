import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const PulseChart = ({ data, isUnstable }) => {
  return (
    <div className="pulse-chart-container" style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)'} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)'} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(0, 255, 65, 0.05)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="time" 
            hide={true}
          />
          <YAxis 
            domain={[40, 140]} 
            stroke="rgba(0, 255, 65, 0.3)" 
            tick={{ fill: 'var(--text-dim)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'var(--bg-panel-dark)', 
              border: '1px solid var(--border-industrial)',
              color: '#fff',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)'
            }}
            itemStyle={{ color: isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)' }}
          />
          <Area 
            type="monotone" 
            dataKey="pulse" 
            stroke={isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)'} 
            fillOpacity={1} 
            fill="url(#colorPulse)" 
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PulseChart;

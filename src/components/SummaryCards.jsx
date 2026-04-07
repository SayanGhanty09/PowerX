import React from 'react';
import { Power, Activity, AlertTriangle, Cpu } from 'lucide-react';

const SummaryCard = ({ icon: Icon, title, value, color, description }) => (
  <div className="glass-panel card-hover" style={{ 
    flex: 1, 
    minWidth: '250px', 
    padding: '1.75rem',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Background Glow */}
    <div style={{ 
      position: 'absolute', 
      top: '-20px', 
      right: '-20px', 
      width: '80px', 
      height: '80px', 
      background: `rgb(${color})`, 
      filter: 'blur(40px)', 
      opacity: 0.1 
    }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div style={{ 
        background: `rgba(${color}, 0.1)`, 
        padding: '0.8rem', 
        borderRadius: '1rem', 
        color: `rgb(${color})`,
        border: `1px solid rgba(${color}, 0.2)`,
        boxShadow: `0 0 15px rgba(${color}, 0.1)`
      }}>
        <Icon size={26} />
      </div>
      <div className="badge badge-normal" style={{ 
        background: `rgba(${color}, 0.05)`, 
        color: `rgb(${color})`,
        borderColor: `rgba(${color}, 0.2)`,
        fontSize: '0.7rem'
      }}>
         LIVE DATA
      </div>
    </div>
    
    <div style={{ marginBottom: '0.5rem' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{value}</span>
      </div>
    </div>
    
    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 500 }}>{description}</p>
  </div>
);

const SummaryCards = ({ data }) => {
  const stats = [
    {
      icon: Cpu,
      title: 'Total Appliances',
      value: data.total || 0,
      color: '59, 130, 246', // Blue
      description: 'Connected via Gateway'
    },
    {
      icon: Activity,
      title: 'Healthy Systems',
      value: data.healthy || 0,
      color: '16, 185, 129', // Green
      description: 'Operations optimal'
    },
    {
      icon: AlertTriangle,
      title: 'Active Faults',
      value: data.faulty || 0,
      color: '239, 68, 68', // Red
      description: 'Requires immediate action'
    },
    {
      icon: Power,
      title: 'Total Load',
      value: `${data.totalCurrent || 0}A`,
      color: '245, 158, 11', // Amber
      description: 'Cumulative system draw'
    }
  ];

  return (
    <div style={{ 
      gridColumn: '1 / -1', 
      display: 'flex', 
      gap: '1.5rem', 
      flexWrap: 'wrap',
      marginBottom: '1rem'
    }}>
      {stats.map((stat, index) => (
        <SummaryCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default SummaryCards;

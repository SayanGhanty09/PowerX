import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  BarChart3, 
  History, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Appliances', path: '/appliances', icon: Cpu },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Event Logs', path: '/logs', icon: History },
  ];

  return (
    <aside className="sidebar">
      <div className="brand" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Zap size={22} fill="white" />
        </div>
        <div className="sidebar-logo-text">
          <h2 style={{ 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            letterSpacing: '-0.03em',
            margin: 0,
            background: 'linear-gradient(to right, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            PowerX Hub
          </h2>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Smart Monitor
          </p>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <item.icon size={20} />
              <span className="nav-text">{item.name}</span>
            </div>
            {/* Active Indicator Chevron */}
            <div className="nav-text active-chevron">
               <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ 
        padding: '1.25rem', 
        marginTop: 'auto',
        background: 'rgba(59, 130, 246, 0.03)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(59, 130, 146, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Glow */}
        <div style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '-20px', 
          width: '60px', 
          height: '60px', 
          background: 'var(--accent-primary)', 
          filter: 'blur(30px)', 
          opacity: 0.2 
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div className="dot dot-active" style={{ color: 'var(--status-normal)', background: 'var(--status-normal)' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Secure Node</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
          <Database size={12} />
          <span style={{ fontSize: '0.65rem' }}>Consentium v2.4</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)' }}>
          <ShieldCheck size={12} />
          <span style={{ fontSize: '0.65rem' }}>SSL Encrypted</span>
        </div>
      </div>

      <style>{`
        .nav-link.active .active-chevron { 
          opacity: 1; 
          transform: translateX(4px); 
          transition: all 0.3s ease; 
        }
        .nav-link:not(.active) .active-chevron { display: none; }
      `}</style>
    </aside>
  );
};

export default Sidebar;

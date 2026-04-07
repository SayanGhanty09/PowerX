import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  BarChart3, 
  History, 
  Zap, 
  Settings,
  Terminal,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Core System', path: '/', icon: LayoutDashboard },
    { name: 'Mecha Fleet', path: '/appliances', icon: Cpu },
    { name: 'Telemetry', path: '/analytics', icon: BarChart3 },
    { name: 'Access Logs', path: '/logs', icon: History },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Section - Pure Green Hacker Logo */}
      <div className="brand" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        paddingLeft: '0.2rem',
        marginBottom: '3rem',
        position: 'relative'
      }}>
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.4)',
          width: '42px',
          height: '42px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--cyber-blue)',
          border: '2px solid var(--cyber-blue)',
          boxShadow: '0 0 12px var(--cyber-blue-glow)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
          flexShrink: 0
        }}>
          <Zap size={22} fill="var(--cyber-blue)" />
        </div>
        <div className="sidebar-logo-text">
          <h2 style={{ 
            fontWeight: 900, 
            fontSize: '1.15rem', 
            letterSpacing: '0.05em',
            margin: 0,
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 1
          }}>
            ROBO-CORE
          </h2>
          <p className="telemetry-text" style={{ fontSize: '0.55rem', marginTop: '0.25rem', opacity: 0.7 }}>
             OS_v4.2 // ONLINE
          </p>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <p className="sidebar-logo-text" style={{ 
          fontSize: '0.62rem', 
          color: 'var(--gunmetal)', 
          fontWeight: 900, 
          letterSpacing: '0.2em', 
          marginBottom: '0.75rem', 
          paddingLeft: '1.5rem',
          textTransform: 'uppercase',
          opacity: 0.6 
        }}>INTERFACE_CTRL</p>
        
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} style={{ flexShrink: 0 }} />
            <span className="nav-text" style={{ fontWeight: 800 }}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer - Professional Compact Stats */}
      <div className="sidebar-logo-text" style={{ 
        padding: '1.25rem', 
        marginTop: 'auto',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-industrial)',
        clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--cyber-blue)', boxShadow: '0 0 8px var(--cyber-blue)', borderRadius: '1px' }}></div>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', color: '#fff' }}>KERNEL_SAFE</span>
        </div>
        
        <div className="telemetry-text" style={{ fontSize: '0.6rem', lineHeight: '1.4', opacity: 0.8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>CPU</span>
            <span style={{ color: '#fff' }}>12%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TEMP</span>
            <span style={{ color: '#fff' }}>42°C</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--alert-orange)' }}>
            <span>LINK</span>
            <span style={{ fontSize: '0.5rem' }}>[||--]</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

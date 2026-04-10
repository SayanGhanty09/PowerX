import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu
} from 'lucide-react';
import PulseChart from '../components/PulseChart';
import apiService from '../services/api';

const SensorDashboard = () => {
  const [data, setData] = useState([]);
  const [isUnstable, setIsUnstable] = useState(false);
  const [pulseValue, setPulseValue] = useState(0);
  const [apiKey, setApiKey] = useState('df87a1133e1dd89441758a2c8e1a9550'); // Placeholder for User
  const dataRef = useRef([]);

  useEffect(() => {
    // Initialize with some data points
    const initialData = [];
    const now = Date.now();
    for (let i = 19; i >= 0; i--) {
      initialData.push({
        time: new Date(now - i * 1000).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        pulse: 60 + Math.random() * 5
      });
    }
    dataRef.current = initialData;
    setData(initialData);

    const interval = setInterval(() => {
      // 9 SECOND CYCLE: 5s Stable (0-5000ms), 4s Unstable (5000-9000ms)
      const cyclePos = Date.now() % 9000;
      const currentStable = cyclePos < 5000;
      setIsUnstable(!currentStable);

      const lastPulse = dataRef.current[dataRef.current.length - 1]?.pulse || 62;
      let newPulse;

      if (!currentStable) {
        // Unstable Phase: High jitter and higher values (105 - 135)
        newPulse = 105 + Math.random() * 30;
      } else {
        // Stable Phase: Natural drift around 60-65
        const drift = (Math.random() - 0.5) * 2;
        newPulse = Math.max(59, Math.min(68, lastPulse + drift));
      }

      setPulseValue(newPulse.toFixed(1));

      const newPoint = {
        time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        pulse: parseFloat(newPulse.toFixed(1))
      };

      const updatedData = [...dataRef.current.slice(-19), newPoint];
      dataRef.current = updatedData;
      setData(updatedData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container mecha-fadeIn">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', opacity: 0.8 }}>[ DEPT: BIOSENSOR_ARRAY_v1.0 ]</span>
          <h1 className="page-title">PULSE_MONITOR</h1>
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.15rem' }}>
            <div className="telemetry-text" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)' }}>
              <Activity size={10} /> {isUnstable ? 'SIGNAL_JITTER' : 'SIGNAL_LOCKED'}
            </div>
            <div className="telemetry-text" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Cpu size={10} /> LRD_SENSOR_INPUT
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            color: isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)',
            fontSize: '0.7rem',
            fontWeight: 900,
            background: 'rgba(0,0,0,0.4)',
            padding: '0.2rem 0.5rem',
            border: `1px solid ${isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)'}`,
            borderRadius: '2px',
            display: 'inline-block'
          }}>
            {isUnstable ? 'UNSTABLE_STATE' : 'STATE_NORMAL'}
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem', marginTop: '1.5rem' }}>
        {/* Main Graph Panel */}
        <div className="mecha-panel" style={{ gridColumn: '1 / 9', padding: '1.5rem', minHeight: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ borderLeft: '3px solid var(--cyber-blue)', paddingLeft: '0.6rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff' }}>PULSE_FREQUENCY_STREAM</h3>
              <p className="telemetry-text" style={{ fontSize: '0.6rem', opacity: 0.6 }}>REALTIME_LRD_TELEMETRY</p>
            </div>
            <div className="telemetry-text" style={{ color: 'var(--cyber-blue)', border: '1px solid rgba(0, 255, 65, 0.3)', padding: '0.35rem 0.7rem', fontSize: '0.6rem' }}>AUTO_DETECTION_ON</div>
          </div>

          <PulseChart data={data} isUnstable={isUnstable} />

          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', border: '1px solid var(--border-industrial)', display: 'flex', flexDirection: 'column' }}>
              <p className="telemetry-text" style={{ fontSize: '0.55rem', opacity: 0.7 }}>LDR_RESISTANCE</p>
              <div style={{ display: 'flex', gap: '3px', marginTop: '1rem', height: '2rem', alignItems: 'flex-end' }}>
                {[...Array(12)].map((_, i) => {
                  const segments = Math.ceil(((pulseValue - 58) / 80) * 12);
                  const isActive = i < segments;
                  return (
                    <div key={i} style={{
                      flex: 1,
                      height: `${(i + 1) * 8.3}%`,
                      backgroundColor: isActive ? (isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)') : 'rgba(255,255,255,0.05)',
                      boxShadow: isActive ? `0 0 12px ${isUnstable ? 'var(--alert-orange-glow)' : 'var(--cyber-blue-glow)'}` : 'none',
                      transition: 'all 0.15s ease'
                    }} />
                  );
                })}
              </div>
              <div className="telemetry-text" style={{ fontSize: '0.5rem', marginTop: '0.5rem', opacity: 0.5, textAlign: 'right' }}>INTENSITY_LEVEL</div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', border: '1px solid var(--border-industrial)' }}>
              <p className="telemetry-text" style={{ fontSize: '0.55rem', opacity: 0.7 }}>OHMIC_VAR_PEAK</p>
              <div style={{ display: 'flex', gap: '2px', marginTop: '1rem', height: '2rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <style>
                  {`
                    @keyframes scanline {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                  `}
                </style>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.1), transparent)',
                  animation: 'scanline 3s infinite linear',
                  zIndex: 2,
                  pointerEvents: 'none'
                }} />
                {[...Array(24)].map((_, i) => {
                  // Add subtle jitter based on pulseValue
                  const jitter = (Math.sin(Date.now() / 500 + i) * 2);
                  const isActive = i < 16 + (Math.random() < 0.1 ? 2 : 0);
                  return (
                    <div key={i} style={{
                      width: '3px',
                      height: i % 4 === 0 ? `${80 + jitter}%` : `${30 + jitter}%`,
                      backgroundColor: isActive ? 'var(--cyber-blue)' : 'rgba(255,255,255,0.05)',
                      opacity: isActive ? 0.8 : 0.2,
                      transition: 'height 0.3s ease'
                    }} />
                  );
                })}
              </div>
              <div className="telemetry-text" style={{ fontSize: '0.5rem', marginTop: '0.5rem', opacity: 0.5 }}>SIGNAL_SCAN_ACTIVE</div>
            </div>

            <div style={{
              background: isUnstable ? 'rgba(255, 157, 0, 0.12)' : 'rgba(0,0,0,0.3)',
              padding: '1rem',
              border: isUnstable ? '2px solid var(--alert-orange)' : '1px solid var(--border-industrial)',
              boxShadow: isUnstable ? '0 0 30px var(--alert-orange-glow)' : 'none',
              animation: isUnstable ? 'heavy-pulse 1s infinite ease-in-out, border-flow 2s infinite linear' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {isUnstable && <div className="glow-streak" />}
              <p className="telemetry-text" style={{ fontSize: '0.55rem', opacity: 0.7, position: 'relative', zIndex: 2 }}>VARIANCE_STATE</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', position: 'relative', zIndex: 2 }}>
                <span className="value-prominent" style={{
                  fontSize: '2rem',
                  color: isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)',
                  textShadow: isUnstable ? '0 0 15px var(--alert-orange-glow)' : 'none'
                }}>
                  {isUnstable ? 'HIGH' : 'LOW'}
                </span>
                <span className="telemetry-text" style={{ fontSize: '0.6rem', opacity: 0.6 }}>[SCAN]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Alerts Side Panel */}
        <div style={{ gridColumn: '9 / -1', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="mecha-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={20} color="var(--cyber-blue)" />
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>SYSTEM_SECURITY</h4>
            </div>
            <div className="telemetry-text" style={{ fontSize: '0.65rem', lineHeight: '1.5', textTransform: 'none', color: 'var(--text-dim)' }}>
              Sensor integrity verified. Encrypted stream active over port 8080. Zero packet loss detected in current session.
            </div>
          </div>

          <div className="mecha-panel" style={{
            padding: '1.25rem',
            border: isUnstable ? '2px solid var(--alert-orange)' : '1px solid var(--border-industrial)',
            background: isUnstable ? 'rgba(255, 157, 0, 0.12)' : 'var(--bg-panel)',
            boxShadow: isUnstable ? '0 0 40px var(--alert-orange-glow), inset 0 0 20px rgba(255, 157, 0, 0.1)' : 'none',
            animation: isUnstable ? 'heavy-pulse 1s infinite ease-in-out, border-flow 2s infinite linear' : 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <style>
              {`
                @keyframes heavy-pulse {
                  0% { box-shadow: 0 0 15px var(--alert-orange-glow); }
                  50% { box-shadow: 0 0 50px var(--alert-orange-glow); }
                  100% { box-shadow: 0 0 15px var(--alert-orange-glow); }
                }

                @keyframes border-flow {
                  0% { border-color: var(--alert-orange); }
                  25% { border-color: #fff; }
                  50% { border-color: var(--alert-orange); }
                  75% { border-color: #ff5500; }
                  100% { border-color: var(--alert-orange); }
                }

                .glow-streak {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: -100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 157, 0, 0.4), transparent);
                  animation: streak 2.5s infinite linear;
                  pointer-events: none;
                }

                @keyframes streak {
                  0% { left: -100%; }
                  100% { left: 100%; }
                }
              `}
            </style>
            {isUnstable && <div className="glow-streak" />}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
              <AlertTriangle size={24} color={isUnstable ? 'var(--alert-orange)' : 'var(--text-dim)'} style={{ filter: isUnstable ? 'drop-shadow(0 0 12px var(--alert-orange-glow))' : 'none' }} />
              <h4 style={{ fontWeight: 900, fontSize: '1rem', color: '#fff', letterSpacing: '0.08em' }}>ALERT_CONSOLE</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isUnstable ? (
                <div style={{ background: 'rgba(255, 157, 0, 0.1)', padding: '0.75rem', borderLeft: '3px solid var(--alert-orange)' }}>
                  <p className="telemetry-text" style={{ fontSize: '0.6rem', color: 'var(--alert-orange)' }}>CRITICAL_ALERT</p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.2rem' }}>UNSTABLE_SIGNAL_DETECTED</p>
                  <p className="telemetry-text" style={{ fontSize: '0.55rem', opacity: 0.7, marginTop: '0.2rem' }}>SRC: LRD_SENSOR_01</p>
                </div>
              ) : (
                <div style={{ opacity: 0.5, textAlign: 'center', padding: '1rem' }}>
                  <Zap size={16} color="var(--cyber-blue)" style={{ marginBottom: '0.5rem' }} />
                  <p className="telemetry-text" style={{ fontSize: '0.6rem' }}>NO_THREATS_DETECTED</p>
                </div>
              )}
            </div>
          </div>

          <div className="mecha-panel" style={{ padding: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Terminal size={20} color="var(--cyber-blue)" />
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>DEBUG_LOGS</h4>
            </div>
            <div className="telemetry-text" style={{ fontSize: '0.55rem', lineHeight: '1.6', opacity: 0.8 }}>
              [10:52:01] HANDSHAKE_INIT...<br />
              [10:52:02] AUTH_SUCCESS<br />
              [10:52:03] STREAM_START<br />
              {isUnstable && <span style={{ color: 'var(--alert-orange)' }}>[10:52:45] ERR: JITTER_THRESHOLD_EXCEEDED</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;

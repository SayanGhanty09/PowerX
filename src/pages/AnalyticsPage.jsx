import React, { useState, useEffect, useRef } from 'react';
import { 
  Download,
  Zap,
  Activity,
  ShieldCheck,
  Terminal,
  TrendingUp,
  FileDown
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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const AnalyticsPage = () => {
  const [powerData, setPowerData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [currentLoad, setCurrentLoad] = useState(24.2);
  const [isUnstable, setIsUnstable] = useState(false);
  const historyRef = useRef([]);
  const powerRef = useRef([]);
  const reportTemplateRef = useRef(null);

  useEffect(() => {
    // Initialize
    const initPower = Array.from({ length: 7 }, (_, i) => ({ v: 22 + Math.random() * 3 }));
    const initHistory = Array.from({ length: 15 }, (_, i) => ({
      time: new Date(Date.now() - (15 - i) * 1000).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
      current: 25 + Math.random() * 5
    }));
    
    setPowerData(initPower);
    powerRef.current = initPower;
    setHistoryData(initHistory);
    historyRef.current = initHistory;

    const interval = setInterval(() => {
      const cyclePos = Date.now() % 9000;
      const currentStable = cyclePos < 5000;
      setIsUnstable(!currentStable);

      let newLoad;
      if (!currentStable) {
        // Unstable Phase: High load spikes (40 - 55 AMP)
        newLoad = 40 + Math.random() * 15;
      } else {
        // Stable Phase: Normal load (22 - 26 AMP)
        newLoad = 22 + Math.random() * 4;
      }

      setCurrentLoad(newLoad.toFixed(1));

      // Update Sparkline
      const nextPower = [...powerRef.current.slice(-6), { v: parseFloat(newLoad.toFixed(1)) }];
      powerRef.current = nextPower;
      setPowerData(nextPower);

      // Update Main History Graph
      const nextHistoryPoint = {
        time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        current: parseFloat(newLoad.toFixed(1))
      };
      const nextHistory = [...historyRef.current.slice(-14), nextHistoryPoint];
      historyRef.current = nextHistory;
      setHistoryData(nextHistory);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Document Meta
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(40, 44, 52);
    pdf.text('POWERX TELEMETRY ANALYTICS REPORT', 20, 30);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    const reportID = Math.random().toString(36).substring(7).toUpperCase();
    pdf.text(`REPORT_ID: PX-${reportID}`, 20, 38);
    pdf.text(`GENERATED_AT: ${new Date().toLocaleString()}`, 20, 43);
    pdf.text('DEPARTMENT: SYSTEM_DIAGNOSTICS_CORE_v4', 20, 48);
    
    // Aesthetic Divider
    pdf.setDrawColor(200);
    pdf.line(20, 55, 190, 55); 

    // Executive Summary
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 102, 204); // Navy Blue for sections
    pdf.text('1. EXECUTIVE SUMMARY', 20, 70);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0);
    pdf.text(`Average Power Load recorded at: ${currentLoad} AMP`, 25, 80);
    pdf.text(`System Stability State: ${isUnstable ? 'CRITICAL / SIGNAL_JITTER_DETECTED' : 'OPTIMAL / STABLE'}`, 25, 87);
    pdf.text(`Resolution Efficiency: 92% (Kernel Verified)`, 25, 94);
    
    // Telemetry Logs Table
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 102, 204);
    pdf.text('2. CORE_LOAD_TELEMETRY (LAST 15 SEC)', 20, 110);
    
    // Table Header
    pdf.setFillColor(245, 245, 245);
    pdf.rect(20, 115, 170, 8, 'F');
    pdf.setFontSize(9);
    pdf.setTextColor(80);
    pdf.text('TIMESTAMP_IDX', 30, 121);
    pdf.text('FLOW_AMPLITUDE (AMP)', 100, 121);
    pdf.text('INTEGRITY_STATUS', 160, 121);
    
    // Render Table Rows
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0);
    historyData.forEach((row, i) => {
      const y = 129 + (i * 7);
      
      // Zebra striping
      if (i % 2 === 0) {
        pdf.setFillColor(252, 252, 252);
        pdf.rect(20, y - 5, 170, 7, 'F');
      }

      pdf.text(row.time, 30, y);
      pdf.text(`${row.current} A`, 100, y);
      
      const isHigh = row.current > 40;
      if (isHigh) {
        pdf.setTextColor(200, 0, 0); // Red alert for PDF
        pdf.text('SPIKE', 160, y);
        pdf.setTextColor(0);
      } else {
        pdf.text('VALID', 160, y);
      }
      
      // Bottom border for each cell
      pdf.setDrawColor(240);
      pdf.line(20, y + 2, 190, y + 2);
    });

    // Branding Footer
    const pageCount = pdf.internal.getNumberOfPages();
    pdf.setFontSize(8);
    pdf.setTextColor(180);
    for(let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(`PowerX Industrial Monitoring System | Consentium_IoT RSA Verified`, 20, 285);
      pdf.text(`Page ${i} of ${pageCount}`, 170, 285);
    }

    pdf.save(`PowerX_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const resolutionData = [
    { name: 'Resolved', value: 92, color: '#10b981' },
    { name: 'Pending', value: 8, color: 'var(--gunmetal)' }
  ];

  const mockBarData = [
    { name: 'Pump', faults: isUnstable ? 4 : 1 },
    { name: 'Heater', faults: isUnstable ? 6 : 2 },
    { name: 'Exhaust', faults: 0 },
    { name: 'AC', faults: isUnstable ? 3 : 1 },
    { name: 'Motor', faults: isUnstable ? 5 : 0 },
    { name: 'Valve', faults: 0 },
  ];

  return (
    <div className="page-container mecha-fadeIn" ref={reportTemplateRef}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '3rem' }}>
        <div>
          <span className="telemetry-text" style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>[ DEPT: DATA_PROCESSING_CORE_v4.2 ]</span>
          <h1 className="page-title">TELEMETRY_DAT</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleDownloadPDF}
            className="telemetry-text" 
            style={{ 
              padding: '1rem 2rem', 
              background: 'var(--cyber-blue)', 
              border: 'none', 
              color: 'var(--bg-main)', 
              clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '1rem',
              boxShadow: '0 0 20px var(--cyber-blue-glow)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FileDown size={20} style={{ marginRight: '0.75rem' }} /> EXPORT_LOG
          </button>
        </div>
      </header>

      {/* Visual Analytics Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
        
        {/* Avg. Power Consumption - Sparkline */}
        <div className="mecha-panel" style={{ 
          padding: '2rem', 
          height: '220px', 
          display: 'flex', 
          flexDirection: 'column',
          border: isUnstable ? '1px solid var(--alert-orange)' : '1px solid var(--border-industrial)',
          boxShadow: isUnstable ? '0 0 15px var(--alert-orange-glow)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <p className="telemetry-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>AVG_PWR_LOAD</p>
              <h2 className="value-prominent" style={{ fontSize: '2.5rem', color: isUnstable ? 'var(--alert-orange)' : '#fff' }}>{currentLoad}<span style={{ fontSize: '1rem', color: isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)', marginLeft: '0.5rem' }}>AMP</span></h2>
            </div>
            <div style={{ color: isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)', filter: isUnstable ? 'drop-shadow(0 0 8px var(--alert-orange-glow))' : 'drop-shadow(0 0 8px var(--cyber-blue-glow))' }}>
              <Zap size={24} fill={isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)'} />
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerData}>
                <Area 
                  type="stepAfter" 
                  dataKey="v" 
                  stroke={isUnstable ? 'var(--alert-orange)' : 'var(--cyber-blue)'} 
                  fill={isUnstable ? 'rgba(255, 157, 0, 0.15)' : 'rgba(0, 242, 255, 0.15)'} 
                  strokeWidth={3}
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Load Recorded - Pictorial Indicator */}
        <div className="mecha-panel" style={{ 
          padding: '2rem', 
          height: '220px', 
          position: 'relative', 
          overflow: 'hidden',
          border: isUnstable ? '1px solid var(--alert-orange)' : '1px solid var(--border-industrial)',
          boxShadow: isUnstable ? '0 0 20px var(--alert-orange-glow)' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="telemetry-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>PEAK_THRESHOLD</p>
              <h2 className="value-prominent" style={{ fontSize: '2.5rem', color: 'var(--alert-orange)' }}>{isUnstable ? '48.2' : '26.4'}<span style={{ fontSize: '1rem', color: 'var(--alert-orange)', marginLeft: '0.5rem' }}>AMP</span></h2>
            </div>
            <div style={{ color: 'var(--alert-orange)', filter: 'drop-shadow(0 0 8px var(--alert-orange-glow))' }}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ height: '12px', width: '100%', background: 'var(--bg-main)', border: '1px solid var(--gunmetal)', position: 'relative' }}>
              <div style={{ 
                height: '100%', 
                width: isUnstable ? '94%' : '52%', 
                background: isUnstable ? 'var(--alert-orange)' : 'linear-gradient(to right, var(--cyber-blue), var(--alert-orange))', 
                boxShadow: isUnstable ? '0 0 20px var(--alert-orange-glow)' : 'none',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--gunmetal)', fontWeight: 800 }}>
              <span className="telemetry-text">0_AMP</span>
              <span className="telemetry-text" style={{ color: isUnstable ? 'var(--alert-orange)' : 'var(--gunmetal)' }}>{isUnstable ? 'ALERT_LIMIT_EXCEEDED' : 'CRITICAL_LIMIT_50A'}</span>
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
                  <Cell fill={isUnstable ? 'var(--alert-orange)' : '#10b981'} />
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
              color: isUnstable ? 'var(--alert-orange)' : '#10b981',
              fontFamily: 'var(--font-mono)',
              textShadow: isUnstable ? '0 0 10px var(--alert-orange-glow)' : '0 0 10px rgba(16, 185, 129, 0.4)'
            }}>{isUnstable ? '68%' : '92%'}</div>
          </div>
          <div>
            <p className="telemetry-text" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>RESOLUTION_EFF</p>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', fontWeight: 800 }}>{isUnstable ? 'System_Stressed' : 'Kernel_Stable'}</h4>
            <p className="telemetry-text" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isUnstable ? '12/30 FAILURES_ACTV' : '28/30 SYS_ERR_CLR'}</p>
          </div>
        </div>

      </div>

      <ChartsSection lineData={historyData} barData={mockBarData} />

      {/* Advanced Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', marginTop: '2.5rem' }}>
        <div className="mecha-panel" style={{ 
          gridColumn: '1 / 7', 
          padding: '2.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem',
          border: isUnstable ? '1px solid var(--alert-orange)' : '1px solid var(--border-industrial)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            background: isUnstable ? 'rgba(255, 157, 0, 0.1)' : 'rgba(139, 92, 246, 0.1)', 
            padding: '1.25rem', 
            color: isUnstable ? 'var(--alert-orange)' : '#8b5cf6', 
            border: `1px solid ${isUnstable ? 'var(--alert-orange)' : 'rgba(139, 92, 246, 0.3)'}`,
            filter: isUnstable ? 'drop-shadow(0 0 10px var(--alert-orange-glow))' : 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.2))'
          }}>
            <Activity size={40} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', textTransform: 'uppercase' }}>{isUnstable ? 'Jitter_Detected' : 'Stability_Score'}</h3>
            <p className="telemetry-text" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>
              {isUnstable ? 'CRITICAL: High variance in signal frequency detected.' : 'System-wide signal integrity verified at 98.4% freq.'}
            </p>
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

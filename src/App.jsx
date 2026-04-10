import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BackgroundEffect from './components/BackgroundEffect';
import SensorDashboard from './pages/SensorDashboard';
import DashboardPage from './pages/DashboardPage';
import AppliancesPage from './pages/AppliancesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LogsPage from './pages/LogsPage';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <BackgroundEffect />
        <Sidebar />
        <main className="main-content fadeIn">
          <Routes>
            <Route path="/" element={<SensorDashboard />} />
            <Route path="/system" element={<DashboardPage />} />
            <Route path="/appliances" element={<AppliancesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

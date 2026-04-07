import React from 'react';
import ApplianceCard from './ApplianceCard';

const ApplianceGrid = ({ appliances }) => {
  return (
    <div style={{ 
      gridColumn: '1 / 9', 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '1.5rem' 
    }}>
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Device Status Overview</h2>
        <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Showing {appliances.length} active monitors</span>
      </div>
      {appliances.map((appliance) => (
        <ApplianceCard key={appliance.id} appliance={appliance} />
      ))}
    </div>
  );
};

export default ApplianceGrid;

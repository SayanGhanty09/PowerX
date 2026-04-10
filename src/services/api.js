import axios from 'axios';

// Consentium IoT API Configuration (Placeholders)
const API_BASE_URL = 'https://api.consentiumiot.com/v1'; // Example URL
const API_KEY = 'YOUR_API_KEY';

/**
 * Mock Data for initial development
 */
export const mockAppliances = [
  { id: '1', name: 'Main Water Pump', status: 'NORMAL', current: 4.2, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Kitchen Exhaust', status: 'NORMAL', current: 0.8, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Industrial Heater', status: 'WARNING', current: 12.5, lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Air Compressor', status: 'NORMAL', current: 3.1, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Conveyor Motor', status: 'FAULT', current: 0.0, lastUpdated: new Date().toISOString() },
  { id: '6', name: 'Central AC Unit', status: 'NORMAL', current: 8.4, lastUpdated: new Date().toISOString() },
];

export const mockAlerts = [
  { id: 'a1', timestamp: '12:32:10', type: 'Motor Overcurrent', location: 'Section B - Kitchen' },
  { id: 'a2', timestamp: '11:45:05', type: 'Voltage Drop Detected', location: 'Main Distribution Board' },
  { id: 'a3', timestamp: '10:15:30', type: 'Heater Temperature High', location: 'Processing Unit 1' },
];

export const mockLogs = [
  { timestamp: '12:45:01', type: 'INFO', message: 'System startup successful. RF Receiver initialized on channel 4.' },
  { timestamp: '12:45:05', type: 'DATA', message: 'Appliance handshake verified for: Main Water Pump, Kitchen Exhaust.' },
  { timestamp: '12:46:12', type: 'ALERT', message: 'Power spike detected in INDUSTRIAL HEATER. Switching to safety mode.' },
  { timestamp: '12:47:00', type: 'INFO', message: 'Cloud sync successful with Consentium IoT endpoint.' },
  { timestamp: '12:48:33', type: 'DATA', message: 'Environmental sensors updated: Humidity 45%, Temp 24C.' },
];

export const mockHistory = [
  { time: '12:00', current: 24.5 },
  { time: '12:05', current: 28.2 },
  { time: '12:10', current: 22.1 },
  { time: '12:15', current: 35.4 },
  { time: '12:20', current: 31.8 },
  { time: '12:25', current: 29.5 },
  { time: '12:30', current: 30.1 },
];

export const mockBarData = [
  { name: 'Pump', faults: 1 },
  { name: 'Heater', faults: 4 },
  { name: 'Exhaust', faults: 0 },
  { name: 'AC', faults: 1 },
  { name: 'Motor', faults: 3 },
  { name: 'Valve', faults: 0 },
];

/**
 * API Service for Consentium IoT
 */
const apiService = {
  // GET: Fetch all appliance data
  fetchApplianceData: async () => {
    try {
      // In a real scenario, we would use axios:
      // const response = await axios.get(`${API_BASE_URL}/devices`, {
      //   headers: { 'X-API-KEY': API_KEY }
      // });
      // return response.data;

      // Returning mock data with slight random variations for simulation
      return mockAppliances.map(app => ({
        ...app,
        current: Math.max(0, (app.current + (Math.random() - 0.5) * 0.5).toFixed(2)),
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching data from Consentium IoT:', error);
      throw error;
    }
  },

  // GET: Fetch sensor data from Consentium IoT
  fetchSensorData: async (apiKey) => {
    try {
      // Endpoint provided by user: https://api.consentiumiot.com/recieve?api_key=
      const response = await axios.get(`https://api.consentiumiot.com/recieve?api_key=${apiKey}`);
      
      // Consentium data normalization:
      // Expecting a list of values or a single object.
      // We'll return the raw data and let the component handle standard forms.
      return response.data;
    } catch (error) {
      console.error('Error fetching data from Consentium IoT:', error);
      return null;
    }
  },

  // POST: Send control command to ESP32 via Cloud
  sendDeviceCommand: async (deviceId, command) => {
    try {
      // await axios.post(`${API_BASE_URL}/control`, { deviceId, command });
      console.log(`Command [${command}] sent to device [${deviceId}]`);
      return true;
    } catch (error) {
      console.error('Error sending command:', error);
      return false;
    }
  }
};

export default apiService;

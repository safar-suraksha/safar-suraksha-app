import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import dotenv from "dotenv"
dotenv.config ()

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'suraksha-net-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with actual database in production)
let officers = [
  { id: 'off-001', name: 'Officer Johnson', badge: 'JN-2024', status: 'active', location: { lat: 40.7589, lng: -73.9851 } },
  { id: 'off-002', name: 'Officer Davis', badge: 'DV-2024', status: 'patrol', location: { lat: 40.7614, lng: -73.9776 } },
  { id: 'off-003', name: 'Officer Martinez', badge: 'MZ-2024', status: 'available', location: { lat: 40.7505, lng: -73.9934 } },
];

let tourists = [
  { 
    id: 'tour-001', 
    name: 'Emma Johnson', 
    phone: '+1-555-0123', 
    email: 'emma@email.com',
    nationality: 'USA',
    passport: 'US123456789',
    status: 'verified',
    location: { lat: 40.7505, lng: -73.9934 },
    groupId: 'Family Tour A',
    checkInTime: '2024-01-15T10:00:00Z'
  },
  { 
    id: 'tour-002', 
    name: 'Carlos Rodriguez', 
    phone: '+1-555-0456', 
    email: 'carlos@email.com',
    nationality: 'Spain',
    passport: 'ES987654321',
    status: 'pending',
    location: { lat: 40.7614, lng: -73.9776 },
    checkInTime: '2024-01-15T11:30:00Z'
  }
];

let sosAlerts = [
  {
    id: 'SOS-001',
    type: 'medical',
    location: 'Central Park, Near Bethesda Fountain',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    timestamp: '2024-01-15T14:23:15Z',
    status: 'active',
    priority: 'critical',
    touristInfo: {
      id: 'tour-001',
      name: 'Emma Johnson',
      phone: '+1-555-0123',
      group: 'Family Tour A'
    },
    description: 'Tourist experiencing chest pain, conscious but distressed',
    assignedOfficer: null,
    responseTime: null
  },
  {
    id: 'SOS-002',
    type: 'lost',
    location: 'Times Square, Near Red Steps',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    timestamp: '2024-01-15T14:18:42Z',
    status: 'responding',
    priority: 'medium',
    touristInfo: {
      id: 'tour-002',
      name: 'Carlos Rodriguez',
      phone: '+1-555-0456'
    },
    assignedOfficer: 'off-002',
    description: 'Lost tourist, separated from group, unfamiliar with area',
    responseTime: '2024-01-15T14:20:00Z'
  }
];

let incidentReports = [
  {
    id: 'RPT-001',
    type: 'theft',
    title: 'Pickpocketing Incident at Times Square',
    location: 'Times Square, 7th Avenue',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    timestamp: '2024-01-15T13:45:00Z',
    status: 'investigating',
    priority: 'medium',
    reportedBy: 'off-001',
    description: 'Tourist reported wallet stolen while taking photos. Suspect description: Male, 5\'8", dark clothing.',
    evidence: ['CCTV footage requested', 'Witness statements'],
    involvedParties: ['tour-001'],
    tags: ['theft', 'tourist', 'times-square']
  }
];

let cameras = [
  { id: 'cam-001', name: 'CCTV-001', location: 'Times Square North', status: 'online', coordinates: { lat: 40.7580, lng: -73.9855 } },
  { id: 'cam-002', name: 'CCTV-002', location: 'Central Park East', status: 'online', coordinates: { lat: 40.7589, lng: -73.9851 } },
  { id: 'cam-003', name: 'CCTV-003', location: 'Brooklyn Bridge', status: 'maintenance', coordinates: { lat: 40.7061, lng: -73.9969 } },
];

let auditLogs = [
  {
    id: 'audit-001',
    timestamp: '2024-01-15T14:23:15Z',
    action: 'SOS_ALERT_CREATED',
    userId: 'system',
    details: 'Emergency alert SOS-001 created for tourist Emma Johnson',
    ipAddress: '192.168.1.100',
    hash: 'a1b2c3d4e5f6...'
  }
];

let notifications = [
  {
    id: 'notif-001',
    title: 'Emergency SOS Alert',
    message: 'Tourist in distress reported at Central Park. Immediate assistance required.',
    type: 'emergency',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high'
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SurakshaNet API is running' });
});

// Authentication
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Mock authentication - replace with real database check
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { id: 'admin-001', username: 'admin', role: 'administrator' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: 'admin-001', username: 'admin', role: 'administrator' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    activeSOS: sosAlerts.filter(a => a.status === 'active').length,
    activeOfficers: officers.filter(o => o.status === 'active' || o.status === 'patrol').length,
    verifiedTourists: tourists.filter(t => t.status === 'verified').length,
    incidentsToday: incidentReports.filter(r => {
      const today = new Date().toDateString();
      return new Date(r.timestamp).toDateString() === today;
    }).length,
    responseTime: '3.2 min',
    systemUptime: '99.8%'
  };
  
  res.json(stats);
});

// Officers
app.get('/api/officers', (req, res) => {
  res.json(officers);
});

app.post('/api/officers/:id/dispatch', (req, res) => {
  const { id } = req.params;
  const { alertId, location } = req.body;
  
  const officer = officers.find(o => o.id === id);
  if (!officer) {
    return res.status(404).json({ success: false, message: 'Officer not found' });
  }
  
  // Update officer status
  officer.status = 'dispatched';
  
  // Update SOS alert if provided
  if (alertId) {
    const alert = sosAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.assignedOfficer = id;
      alert.status = 'responding';
      alert.responseTime = new Date().toISOString();
    }
  }
  
  // Add audit log
  auditLogs.push({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'OFFICER_DISPATCHED',
    userId: req.user?.id || 'system',
    details: `Officer ${officer.name} dispatched to ${location}`,
    ipAddress: req.ip,
    hash: `hash-${Date.now()}`
  });
  
  res.json({ success: true, message: `Officer ${officer.name} dispatched successfully` });
});

// SOS Alerts
app.get('/api/sos-alerts', (req, res) => {
  const { status, priority } = req.query;
  let filtered = sosAlerts;
  
  if (status && status !== 'all') {
    filtered = filtered.filter(alert => alert.status === status);
  }
  
  if (priority && priority !== 'all') {
    filtered = filtered.filter(alert => alert.priority === priority);
  }
  
  res.json(filtered);
});

app.post('/api/sos-alerts', (req, res) => {
  const newAlert = {
    id: `SOS-${String(sosAlerts.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    status: 'active',
    assignedOfficer: null,
    responseTime: null,
    ...req.body
  };
  
  sosAlerts.push(newAlert);
  
  // Add audit log
  auditLogs.push({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'SOS_ALERT_CREATED',
    userId: req.user?.id || 'system',
    details: `SOS Alert ${newAlert.id} created`,
    ipAddress: req.ip,
    hash: `hash-${Date.now()}`
  });
  
  res.json({ success: true, alert: newAlert });
});

app.put('/api/sos-alerts/:id', (req, res) => {
  const { id } = req.params;
  const alertIndex = sosAlerts.findIndex(a => a.id === id);
  
  if (alertIndex === -1) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  
  sosAlerts[alertIndex] = { ...sosAlerts[alertIndex], ...req.body };
  
  // Add audit log
  auditLogs.push({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'SOS_ALERT_UPDATED',
    userId: req.user?.id || 'system',
    details: `SOS Alert ${id} updated`,
    ipAddress: req.ip,
    hash: `hash-${Date.now()}`
  });
  
  res.json({ success: true, alert: sosAlerts[alertIndex] });
});

// Tourists
app.get('/api/tourists', (req, res) => {
  const { status } = req.query;
  let filtered = tourists;
  
  if (status && status !== 'all') {
    filtered = filtered.filter(tourist => tourist.status === status);
  }
  
  res.json(filtered);
});

app.post('/api/tourists', (req, res) => {
  const newTourist = {
    id: `tour-${String(tourists.length + 1).padStart(3, '0')}`,
    status: 'pending',
    checkInTime: new Date().toISOString(),
    ...req.body
  };
  
  tourists.push(newTourist);
  
  res.json({ success: true, tourist: newTourist });
});

app.put('/api/tourists/:id', (req, res) => {
  const { id } = req.params;
  const touristIndex = tourists.findIndex(t => t.id === id);
  
  if (touristIndex === -1) {
    return res.status(404).json({ success: false, message: 'Tourist not found' });
  }
  
  tourists[touristIndex] = { ...tourists[touristIndex], ...req.body };
  
  res.json({ success: true, tourist: tourists[touristIndex] });
});

// Incident Reports
app.get('/api/reports', (req, res) => {
  const { status, type } = req.query;
  let filtered = incidentReports;
  
  if (status && status !== 'all') {
    filtered = filtered.filter(report => report.status === status);
  }
  
  if (type && type !== 'all') {
    filtered = filtered.filter(report => report.type === type);
  }
  
  res.json(filtered);
});

app.post('/api/reports', (req, res) => {
  const newReport = {
    id: `RPT-${String(incidentReports.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    status: 'open',
    ...req.body
  };
  
  incidentReports.push(newReport);
  
  res.json({ success: true, report: newReport });
});

app.put('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const reportIndex = incidentReports.findIndex(r => r.id === id);
  
  if (reportIndex === -1) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }
  
  incidentReports[reportIndex] = { ...incidentReports[reportIndex], ...req.body };
  
  res.json({ success: true, report: incidentReports[reportIndex] });
});

// Export report as PDF (mock)
app.get('/api/reports/:id/export', (req, res) => {
  const { id } = req.params;
  const report = incidentReports.find(r => r.id === id);
  
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }
  
  // Mock PDF generation
  res.json({ 
    success: true, 
    downloadUrl: `/api/downloads/report-${id}.pdf`,
    message: 'PDF export initiated. Download will be available shortly.'
  });
});

// Cameras
app.get('/api/cameras', (req, res) => {
  res.json(cameras);
});

app.get('/api/cameras/:id/view', (req, res) => {
  const { id } = req.params;
  const camera = cameras.find(c => c.id === id);
  
  if (!camera) {
    return res.status(404).json({ success: false, message: 'Camera not found' });
  }
  
  res.json({ 
    success: true, 
    streamUrl: `ws://localhost:3001/camera-stream/${id}`,
    camera 
  });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notification = notifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }
  
  notification.read = true;
  res.json({ success: true, notification });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  notifications.forEach(n => n.read = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  const { action, userId } = req.query;
  let filtered = auditLogs;
  
  if (action) {
    filtered = filtered.filter(log => log.action.includes(action.toUpperCase()));
  }
  
  if (userId) {
    filtered = filtered.filter(log => log.userId === userId);
  }
  
  res.json(filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

// Communication (Chat)
let chatMessages = [
  {
    id: 'msg-001',
    channelId: 'emergency',
    sender: 'Officer Johnson',
    message: 'Responding to SOS alert at Central Park',
    timestamp: new Date().toISOString(),
    priority: 'high'
  }
];

app.get('/api/chat/channels', (req, res) => {
  const channels = [
    { id: 'emergency', name: 'Emergency Response', type: 'emergency', members: 5 },
    { id: 'patrol', name: 'Patrol Units', type: 'patrol', members: 12 },
    { id: 'dispatch', name: 'Dispatch Center', type: 'dispatch', members: 8 }
  ];
  
  res.json(channels);
});

app.get('/api/chat/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  const filtered = chatMessages.filter(msg => msg.channelId === channelId);
  res.json(filtered);
});

app.post('/api/chat/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  const newMessage = {
    id: `msg-${Date.now()}`,
    channelId,
    timestamp: new Date().toISOString(),
    ...req.body
  };
  
  chatMessages.push(newMessage);
  res.json({ success: true, message: newMessage });
});

// Map data
app.get('/api/map/markers', (req, res) => {
  const { type } = req.query;
  
  let markers = [
    ...officers.map(officer => ({
      id: officer.id,
      type: 'officer',
      position: officer.location,
      label: officer.name,
      status: officer.status,
      info: `Badge: ${officer.badge}`
    })),
    ...tourists.map(tourist => ({
      id: tourist.id,
      type: 'tourist',
      position: tourist.location,
      label: tourist.name,
      status: tourist.status,
      info: tourist.groupId || 'Individual'
    })),
    ...sosAlerts.filter(alert => alert.status === 'active').map(alert => ({
      id: alert.id,
      type: 'alert',
      position: alert.coordinates,
      label: alert.type,
      status: alert.priority,
      info: alert.description
    })),
    ...cameras.map(camera => ({
      id: camera.id,
      type: 'camera',
      position: camera.coordinates,
      label: camera.name,
      status: camera.status,
      info: camera.location
    }))
  ];
  
  if (type && type !== 'all') {
    markers = markers.filter(marker => marker.type === type);
  }
  
  res.json(markers);
});

// Phone call simulation
app.post('/api/call/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  
  // Simulate call initiation
  setTimeout(() => {
    res.json({ 
      success: true, 
      message: `Call initiated to ${phoneNumber}`,
      callId: `call-${Date.now()}`,
      status: 'connecting'
    });
  }, 1000);
});

// Location services
app.post('/api/locate/:touristId', (req, res) => {
  const { touristId } = req.params;
  const tourist = tourists.find(t => t.id === touristId);
  
  if (!tourist) {
    return res.status(404).json({ success: false, message: 'Tourist not found' });
  }
  
  res.json({
    success: true,
    location: tourist.location,
    accuracy: '±5 meters',
    lastUpdated: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚔 SurakshaNet API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
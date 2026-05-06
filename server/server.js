const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://civic-crime-api.onrender.com',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ajendra_as:aju08%402006@cluster0.it5ad3m.mongodb.net/crime-reporting?appName=Cluster0', { dbName: 'crime-reporting' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Attach io to request object for real-time updates
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admins');
const https = require('https');

app.use('/api/reports', reportRoutes);
app.use('/api/admins', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Overpass API Proxy to bypass Vercel frontend CORS blocks
app.get('/api/facilities', (req, res) => {
  const { type, lat, lng, radius } = req.query;
  
  if (!type || !lat || !lng) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  const query = `[out:json][timeout:50];nwr["amenity"="${type}"](around:${radius || 200000}, ${lat}, ${lng});out center 50;`;
  
  const options = {
    hostname: 'overpass-api.de',
    path: `/api/interpreter?data=${encodeURIComponent(query)}`,
    method: 'GET',
    headers: {
      'User-Agent': 'CivicCrimePlatformBackend/1.0'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => data += chunk);
    proxyRes.on('end', () => {
      if (proxyRes.statusCode !== 200) {
        console.error('Overpass API returned status:', proxyRes.statusCode);
        return res.status(500).json({ success: false, message: 'Mapping API Error' });
      }
      try {
        res.json({ success: true, data: JSON.parse(data) });
      } catch (e) {
        console.error('Parse error:', e);
        res.status(500).json({ success: false, message: 'Invalid JSON from Mapping API' });
      }
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ success: false, message: 'Failed to connect to Mapping API' });
  });

  proxyReq.end();
});

// Socket.IO Real-time Updates
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Listen for client events
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  socket.on('joinReports', () => {
    socket.join('reports');
    console.log(`📡 Client ${socket.id} joined reports channel`);
  });

  socket.on('leaveReports', () => {
    socket.leave('reports');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ success: false, message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };

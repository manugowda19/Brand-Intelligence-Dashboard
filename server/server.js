const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Import services
const DataCollector = require('./services/DataCollector');
const SentimentAnalyzer = require('./services/SentimentAnalyzer');
const ConversationProcessor = require('./services/ConversationProcessor');
const DashboardService = require('./services/DashboardService');

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize services
const dataCollector = new DataCollector();
const sentimentAnalyzer = new SentimentAnalyzer();
const conversationProcessor = new ConversationProcessor();
const dashboardService = new DashboardService();

// Real-time data collection
let dashboardData = null;
let lastUpdate = new Date();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  if (dashboardData) {
    socket.emit('dashboard-update', dashboardData);
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    lastUpdate: lastUpdate.toISOString()
  });
});

app.get('/api/dashboard', async (req, res) => {
  try {
    if (!dashboardData) {
      // Initialize with current data
      dashboardData = await dashboardService.getDashboardData();
      lastUpdate = new Date();
    }
    
    res.json({
      ...dashboardData,
      lastUpdated: lastUpdate.toISOString()
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/conversations', async (req, res) => {
  try {
    const { platform, sentiment, limit = 50, offset = 0 } = req.query;
    const conversations = await conversationProcessor.getConversations({
      platform,
      sentiment,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Conversations API error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.get('/api/sentiment/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const trends = await sentimentAnalyzer.getTrends(parseInt(days));
    res.json(trends);
  } catch (error) {
    console.error('Sentiment trends API error:', error);
    res.status(500).json({ error: 'Failed to fetch sentiment trends' });
  }
});

app.get('/api/competitive', async (req, res) => {
  try {
    const competitiveData = await dashboardService.getCompetitiveData();
    res.json(competitiveData);
  } catch (error) {
    console.error('Competitive API error:', error);
    res.status(500).json({ error: 'Failed to fetch competitive data' });
  }
});

app.get('/api/export', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const exportData = await dashboardService.exportData(format);
    
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=dashboard-report.pdf');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dashboard-report.json');
    }
    
    res.send(exportData);
  } catch (error) {
    console.error('Export API error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Real-time data collection cron jobs
cron.schedule('*/5 * * * *', async () => {
  // Collect data every 5 minutes
  try {
    console.log('Starting data collection...');
    const newData = await dataCollector.collectAllData();
    const processedData = await conversationProcessor.processConversations(newData);
    const sentimentData = await sentimentAnalyzer.analyzeSentiments(processedData);
    
    dashboardData = await dashboardService.updateDashboardData(sentimentData);
    lastUpdate = new Date();
    
    // Emit real-time updates to connected clients
    io.emit('dashboard-update', dashboardData);
    
    console.log('Data collection completed at:', lastUpdate.toISOString());
  } catch (error) {
    console.error('Data collection error:', error);
  }
});

// Critical alerts check every minute
cron.schedule('* * * * *', async () => {
  try {
    const criticalAlerts = await conversationProcessor.getCriticalAlerts();
    if (criticalAlerts.length > 0) {
      io.emit('critical-alerts', criticalAlerts);
      console.log('Critical alerts detected:', criticalAlerts.length);
    }
  } catch (error) {
    console.error('Critical alerts check error:', error);
  }
});

// Daily summary at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const dailySummary = await dashboardService.generateDailySummary();
    io.emit('daily-summary', dailySummary);
    console.log('Daily summary generated');
  } catch (error) {
    console.error('Daily summary error:', error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Brand Intelligence API running on port ${PORT}`);
  console.log(`📊 Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`⚡ Real-time updates enabled`);
});

module.exports = { app, server, io }; 
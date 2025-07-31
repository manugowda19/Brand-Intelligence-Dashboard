# 🚀 Live Brand Intelligence Dashboard Setup Guide

Transform your LeapScholar Brand Intelligence Dashboard from mock data to **real-time, live data** from all your company channels!

## 📋 Overview

This guide will help you set up the complete live system that:
- ✅ Collects real data from Twitter, Reddit, Quora, LinkedIn, YouTube
- ✅ Analyzes sentiment using AI/ML
- ✅ Provides real-time updates every 5 minutes
- ✅ Sends critical alerts instantly
- ✅ Generates daily summaries automatically

## 🛠️ Step 1: Backend Setup

### 1.1 Install Backend Dependencies

```bash
cd server
npm install
```

### 1.2 Configure Environment Variables

Copy the example environment file and configure your API keys:

```bash
cp env.example .env
```

Edit `.env` with your actual API credentials:

```env
# Twitter API (Essential for real-time mentions)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Reddit API (For student community monitoring)
REDDIT_CLIENT_ID=your_reddit_client_id_here
REDDIT_CLIENT_SECRET=your_reddit_client_secret_here
REDDIT_USERNAME=your_reddit_username_here
REDDIT_PASSWORD=your_reddit_password_here

# YouTube API (For video comments)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Slack Integration (For critical alerts)
SLACK_BOT_TOKEN=your_slack_bot_token_here
SLACK_CHANNEL_ID=your_slack_channel_id_here
```

### 1.3 Start the Backend Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 🔑 Step 2: API Key Setup

### 2.1 Twitter API Setup
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Apply for Elevated access (required for search API)
4. Generate Bearer Token
5. Add to `.env` file

### 2.2 Reddit API Setup
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new app (script type)
3. Note the client ID and secret
4. Add to `.env` file

### 2.3 YouTube API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create API key
5. Add to `.env` file

### 2.4 Slack Integration (Optional)
1. Go to [Slack API](https://api.slack.com/)
2. Create a new app
3. Add bot token scopes: `chat:write`, `channels:read`
4. Install app to workspace
5. Add bot token to `.env` file

## 🔄 Step 3: Frontend Integration

### 3.1 Update Frontend Configuration

Edit `src/services/api.js` to point to your backend:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
```

### 3.2 Install Socket.IO Client

```bash
npm install socket.io-client
```

### 3.3 Start Frontend

```bash
npm start
```

## 📊 Step 4: Data Collection Verification

### 4.1 Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test dashboard data
curl http://localhost:3001/api/dashboard

# Test conversations
curl http://localhost:3001/api/conversations
```

### 4.2 Monitor Data Collection

Check the server logs for data collection status:

```bash
# Watch server logs
tail -f server/logs/app.log
```

Expected output:
```
🚀 Brand Intelligence API running on port 3001
📊 Dashboard: http://localhost:3000
🔗 API: http://localhost:3001/api
⚡ Real-time updates enabled
Starting data collection...
Data collection completed at: 2024-01-07T12:00:00.000Z
```

## 🎯 Step 5: Customize Keywords & Monitoring

### 5.1 Update Brand Keywords

Edit `server/services/DataCollector.js`:

```javascript
this.keywords = [
  // Your specific brand terms
  'LeapScholar', 'Leap Scholar', 'LeapFinance',
  
  // Your product terms
  'LeapScholar loan', 'LeapScholar counseling', 'IELTS prep',
  
  // Your competitors
  'MPOWER', 'Prodigy Finance', 'IDP', 'KC Overseas',
  
  // Industry terms
  'study abroad 2026', 'US visa problems', 'UK student visa'
];
```

### 5.2 Configure Subreddits

Update Reddit monitoring in `DataCollector.js`:

```javascript
const subreddits = [
  'studyabroad', 
  'gradadmissions', 
  'Indian_Academia', 
  'immigration',
  // Add your specific subreddits
];
```

## 🔔 Step 6: Alert Configuration

### 6.1 Critical Alert Threshold

Set the impact score threshold in `.env`:

```env
CRITICAL_ALERT_THRESHOLD=80
```

### 6.2 Slack Notifications

Configure Slack alerts in `server/services/AlertService.js`:

```javascript
const criticalAlertMessage = {
  text: "🚨 CRITICAL BRAND ALERT",
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${alert.author}* on ${alert.platform}\n${alert.content}`
      }
    }
  ]
};
```

## 📈 Step 7: Performance Optimization

### 7.1 Database Setup (Optional)

For persistent storage, add MongoDB:

```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Add to .env
MONGODB_URI=mongodb://localhost:27017/leapscholar-brand-intelligence
```

### 7.2 Redis Caching (Optional)

For better performance:

```bash
# Install Redis
brew install redis

# Start Redis
brew services start redis

# Add to .env
REDIS_URL=redis://localhost:6379
```

## 🚀 Step 8: Production Deployment

### 8.1 Environment Setup

```bash
# Production environment
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
```

### 8.2 PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start server/server.js --name "brand-intelligence-api"

# Start frontend
pm2 start npm --name "brand-intelligence-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 8.3 Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Step 9: Monitoring & Analytics

### 9.1 Dashboard Metrics

Monitor these key metrics:

- **Data Collection Success Rate**: Should be >95%
- **API Response Time**: Should be <2 seconds
- **Real-time Update Frequency**: Every 5 minutes
- **Critical Alert Response Time**: <1 minute

### 9.2 Log Monitoring

```bash
# Monitor API logs
pm2 logs brand-intelligence-api

# Monitor frontend logs
pm2 logs brand-intelligence-frontend
```

## 🔧 Step 10: Troubleshooting

### Common Issues

1. **API Rate Limits**
   - Solution: Implement rate limiting and caching
   - Check: `server/services/DataCollector.js`

2. **Socket Connection Issues**
   - Solution: Check CORS configuration
   - Check: `server/server.js` socket.io config

3. **Data Not Updating**
   - Solution: Verify cron jobs are running
   - Check: `server/server.js` cron schedules

4. **Sentiment Analysis Accuracy**
   - Solution: Train classifier with more data
   - Check: `server/services/SentimentAnalyzer.js`

## 🎉 Success Indicators

Your live dashboard is working when you see:

✅ **Real-time data** updating every 5 minutes  
✅ **Live indicator** showing "Live" in the header  
✅ **Critical alerts** appearing in Slack  
✅ **Sentiment scores** changing based on real mentions  
✅ **Competitive data** showing actual market position  

## 📞 Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify all API keys are correctly configured
3. Test individual API endpoints
4. Check network connectivity and firewall settings

---

**🎯 Congratulations!** Your LeapScholar Brand Intelligence Dashboard is now live and collecting real data from all your company channels! 
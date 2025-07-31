# LeapScholar Brand Intelligence Dashboard

A unified, action-oriented dashboard for monitoring LeapScholar's brand sentiment and tracking conversations across multiple platforms in real-time.

# Demonstartaion of the video - (https://drive.google.com/file/d/1XLlDGTsleIQsN25Mh27cP-rBr9MoiOHk/view?usp=share_link)[click here]

## 🎯 Vision

Transform from reactive to proactive brand monitoring by providing a "one-stop" Brand Intelligence Dashboard that eliminates manual searching. Get a clear, concise, and immediate understanding of how LeapScholar is perceived online in less than five minutes a day.

## 🚀 Core Features

### Module 1: The 30-Second Overview
- **Overall Sentiment Score**: Simple gauge (0-100) with color coding
- **Total Mentions**: Volume over last 24 hours with percentage change
- **Critical Alerts**: Prominent display of urgent mentions needing attention
- **Platform Distribution**: Overview of monitored platforms

### Module 2: Sentiment Deep Dive
- **Sentiment Breakdown**: Pie chart showing Positive vs. Negative vs. Neutral
- **Trend Analysis**: 30-day sentiment trend line graph
- **Summary Statistics**: Quick metrics for each sentiment category

### Module 3: Emerging Topics & Trends
- **Trending Topics**: Visual cloud of frequent keywords with trend indicators
- **Trending Questions**: Top questions from Quora and Reddit
- **Topic Cloud**: Interactive visualization of trending topics
- **Key Insights**: Actionable insights from trend analysis

### Module 4: Significant Conversations (Action Feed)
- **Prioritized Feed**: Conversations sorted by Impact Score
- **Platform Integration**: Reddit, Twitter, Quora, LinkedIn, YouTube
- **Search & Filter**: Advanced filtering by sentiment and content
- **Engagement Metrics**: Follower count, engagement levels, impact scores

### Module 5: Competitive Pulse
- **Share of Voice**: Comparison with MPOWER, Prodigy Finance, IDP, KC Overseas
- **Sentiment Comparison**: Stacked bar chart showing sentiment breakdown
- **Competitive Insights**: Market position and advantage analysis

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for time formatting
- **HTTP Client**: Axios for API communication

## 📊 Monitored Platforms

### Crucial for Unfiltered Feedback
- **Reddit**: r/studyabroad, r/gradadmissions, r/Indian_Academia
- **Quora**: Student questions and concerns

### Core Social Media
- **X (Twitter)**: Real-time news and customer service queries
- **LinkedIn**: Professional discourse and B2B mentions
- **YouTube**: Comments on videos and student vlogger reviews

### Public News & Blogs
- EdTech and Indian business news outlets

## 🔍 Monitored Keywords

### Brand Terms
- LeapScholar, Leap Scholar, LeapFinance

### Product/Service Terms
- LeapScholar loan, LeapScholar counseling, IELTS prep, student visa help

### Competitor Terms
- MPOWER, Prodigy Finance, IDP, KC Overseas

### Strategic Industry Terms
- study abroad 2026, US visa problems, UK student visa, best country for MS

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leapscholar-brand-intelligence-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Dashboard header with navigation
│   ├── OverviewSection.js    # 30-second overview metrics
│   ├── SentimentSection.js   # Sentiment analysis charts
│   ├── TrendsSection.js      # Emerging topics & trends
│   ├── ConversationsSection.js # Significant conversations feed
│   └── CompetitiveSection.js  # Competitive analysis
├── services/            # API and data services
│   └── api.js          # API configuration and mock data
├── App.js              # Main application component
├── index.js            # React entry point
└── index.css           # Global styles and Tailwind
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### API Integration
The dashboard currently uses mock data for development. To integrate with real APIs:

1. Update the `fetchDashboardData` function in `src/services/api.js`
2. Replace mock data with actual API calls
3. Configure authentication headers as needed

## 📈 Implementation Phases

### Phase 1: MVP Dashboard (1-2 weeks) ✅
- [x] Dashboard UI/UX implementation
- [x] Mock data integration
- [x] Responsive design
- [x] Interactive charts and visualizations

### Phase 2: Integration & Automation (Month 2)
- [ ] Real API integration
- [ ] Slack notifications for critical mentions
- [ ] Automated weekly reports
- [ ] Real-time data updates

### Phase 3: Advanced Features
- [ ] Custom alert configurations
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] User management and permissions

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Main brand color
- **Success**: Green (#22c55e) - Positive metrics
- **Warning**: Yellow (#f59e0b) - Caution indicators
- **Danger**: Red (#ef4444) - Critical alerts
- **Neutral**: Gray (#6b7280) - Default text and borders

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 📊 Success Metrics

The dashboard will be considered successful when:

- **Time Savings**: 4-5 hours per week of manual work eliminated
- **Response Time**: 50%+ reduction in response time to critical feedback
- **Testimonial Discovery**: 3-5 high-quality positive testimonials per month
- **Strategic Insights**: 1+ actionable insight per month for product/content teams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to LeapScholar. All rights reserved.

---

**Built with ❤️ for LeapScholar's Brand Intelligence Team** # Brand-Intelligence-Dashboard
# Brand-Intelligence-Dashboard

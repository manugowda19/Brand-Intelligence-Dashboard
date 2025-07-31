import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

class PDFGenerator {
  constructor() {
    this.doc = null;
    this.currentY = 0;
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 20;
  }

  async generateReport(dashboardData) {
    this.doc = new jsPDF('p', 'mm', 'a4');
    
    // Add company logo and header
    await this.addHeader();
    
    // Add executive summary
    await this.addExecutiveSummary(dashboardData);
    
    // Add sentiment analysis charts
    await this.addSentimentAnalysis(dashboardData);
    
    // Add trending topics
    await this.addTrendingTopics(dashboardData);
    
    // Add conversations table
    await this.addConversationsTable(dashboardData);
    
    // Add competitive analysis
    await this.addCompetitiveAnalysis(dashboardData);
    
    // Add recommendations
    await this.addRecommendations(dashboardData);
    
    // Add footer
    this.addFooter();
    
    return this.doc;
  }

  async addHeader() {
    // Add company logo placeholder
    this.doc.setFillColor(59, 130, 246); // Blue
    this.doc.rect(20, 20, 40, 15, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.text('LeapScholar', 25, 30);
    
    // Add title
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Brand Intelligence Report', 70, 30);
    
    // Add subtitle
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Comprehensive Analysis of Online Brand Perception', 70, 40);
    
    // Add date
    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 70, 50);
    
    // Add decorative line
    this.doc.setDrawColor(59, 130, 246);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 60, 190, 60);
    
    this.currentY = 70;
  }

  async addExecutiveSummary(data) {
    // Add section title
    this.addSectionTitle('Executive Summary', 20);
    
    // Add key metrics boxes
    const metrics = [
      { label: 'Sentiment Score', value: data.overview?.sentimentScore || 78, color: [34, 197, 94] },
      { label: 'Total Mentions', value: data.overview?.totalMentions?.toLocaleString() || '1,247', color: [59, 130, 246] },
      { label: 'Critical Alerts', value: data.overview?.criticalAlerts || 3, color: [239, 68, 68] },
      { label: 'Platforms Monitored', value: '5', color: [168, 85, 247] }
    ];

    let xPos = 20;
    metrics.forEach((metric, index) => {
      // Draw colored box
      this.doc.setFillColor(...metric.color);
      this.doc.rect(xPos, this.currentY, 40, 25, 'F');
      
      // Add value
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(metric.value.toString(), xPos + 20, this.currentY + 12, { align: 'center' });
      
      // Add label
      this.doc.setFontSize(8);
      this.doc.text(metric.label, xPos + 20, this.currentY + 20, { align: 'center' });
      
      xPos += 45;
    });

    this.currentY += 35;

    // Add summary text
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const summaryText = [
      'This report provides a comprehensive analysis of LeapScholar\'s brand perception across',
      'multiple social media platforms. Key findings include strong positive sentiment with',
      'opportunities for improvement in customer service response times.',
      '',
      'The analysis covers conversations from Twitter, Reddit, Quora, LinkedIn, and YouTube,',
      'providing insights into student and parent perceptions of our services.'
    ];

    summaryText.forEach(line => {
      this.doc.text(line, 20, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 10;
  }

  async addSentimentAnalysis(data) {
    this.addSectionTitle('Sentiment Analysis', 20);
    
    // Add sentiment breakdown
    if (data.sentiment?.breakdown) {
      const breakdown = data.sentiment.breakdown;
      
      // Add chart description
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Current Sentiment Distribution', 20, this.currentY);
      this.currentY += 8;

      // Add sentiment breakdown table
      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Sentiment', 'Percentage', 'Count']],
        body: breakdown.map(item => [
          item.name,
          `${item.value}%`,
          Math.round((item.value / 100) * (data.overview?.totalMentions || 1247)).toLocaleString()
        ]),
        styles: {
          headStyle: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
          fontSize: 10
        },
        headStyles: { halign: 'center' },
        bodyStyles: { halign: 'center' }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 15;
    }

    // Add trend analysis
    if (data.sentiment?.trend) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('30-Day Sentiment Trend', 20, this.currentY);
      this.currentY += 8;

      // Create trend table
      const trendData = data.sentiment.trend.slice(-7); // Last 7 days
      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Date', 'Positive', 'Neutral', 'Negative']],
        body: trendData.map(item => [
          new Date(item.date).toLocaleDateString(),
          `${item.positive}%`,
          `${item.neutral}%`,
          `${item.negative}%`
        ]),
        styles: {
          headStyle: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
          fontSize: 9
        },
        headStyles: { halign: 'center' },
        bodyStyles: { halign: 'center' }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 15;
    }
  }

  async addTrendingTopics(data) {
    this.addSectionTitle('Trending Topics & Keywords', 20);
    
    if (data.trends?.topics) {
      const topics = data.trends.topics.slice(0, 8); // Top 8 topics for better fit
      
      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Topic', 'Mentions', 'Trend', 'Insight']],
        body: topics.map(topic => [
          this.cleanText(topic.name, 20),
          topic.count,
          this.getTrendIcon(topic.trend),
          this.cleanText(this.getTopicInsight(topic), 50)
        ]),
        styles: {
          headStyle: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
          fontSize: 9
        },
        headStyles: { halign: 'center' },
        bodyStyles: { halign: 'left' },
        columnStyles: {
          0: { cellWidth: 35, halign: 'left' },
          1: { halign: 'center', cellWidth: 20 },
          2: { halign: 'center', cellWidth: 25 },
          3: { cellWidth: 70, halign: 'left' }
        }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 15;
    }
  }

  async addConversationsTable(data) {
    this.addSectionTitle('Significant Conversations', 20);
    
    if (data.conversations) {
      const conversations = data.conversations.slice(0, 10); // Top 10 conversations for better readability
      
      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Platform', 'Author', 'Sentiment', 'Impact', 'Content']],
        body: conversations.map(conv => [
          conv.platform,
          this.cleanText(conv.author, 15),
          this.getSentimentBadge(conv.sentiment),
          conv.impactScore,
          this.cleanText(conv.content, 80)
        ]),
        styles: {
          headStyle: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
          fontSize: 9
        },
        headStyles: { halign: 'center' },
        bodyStyles: { halign: 'left' },
        columnStyles: {
          0: { cellWidth: 25, halign: 'center' },
          1: { cellWidth: 25, halign: 'left' },
          2: { cellWidth: 25, halign: 'center' },
          3: { halign: 'center', cellWidth: 20 },
          4: { cellWidth: 75, halign: 'left' }
        },
        didDrawCell: function(data) {
          // Add word wrapping for content column
          if (data.column.index === 4) {
            const text = data.cell.text.join(' ');
            if (text.length > 80) {
              data.cell.text = [text.substring(0, 80) + '...'];
            }
          }
        }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 15;
    }
  }

  async addCompetitiveAnalysis(data) {
    this.addSectionTitle('Competitive Analysis', 20);
    
    if (data.competitive?.shareOfVoice) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Share of Voice Comparison', 20, this.currentY);
      this.currentY += 8;

      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Competitor', 'Mentions', 'Share of Voice', 'Sentiment Score']],
        body: data.competitive.shareOfVoice.map(comp => [
          comp.name,
          comp.mentions.toLocaleString(),
          `${comp.percentage}%`,
          this.getCompetitorSentiment(comp.name, data.competitive.sentimentComparison)
        ]),
        styles: {
          headStyle: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
          fontSize: 10
        },
        headStyles: { halign: 'center' },
        bodyStyles: { halign: 'center' }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 15;
    }
  }

  async addRecommendations(data) {
    this.addSectionTitle('Strategic Recommendations', 20);
    
    const recommendations = [
      {
        category: 'Immediate Actions',
        items: [
          'Address the 3 critical alerts within 24 hours',
          'Respond to high-impact negative mentions on Twitter',
          'Monitor Reddit communities for emerging issues'
        ]
      },
      {
        category: 'Content Strategy',
        items: [
          'Create content addressing trending topics (Canada, AI/ML)',
          'Develop FAQ content for common student questions',
          'Highlight positive testimonials on social media'
        ]
      },
      {
        category: 'Competitive Positioning',
        items: [
          'Leverage higher sentiment score vs competitors',
          'Focus on unique value propositions in student loans',
          'Monitor competitor pricing and service changes'
        ]
      }
    ];

    recommendations.forEach(rec => {
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(rec.category, 20, this.currentY);
      this.currentY += 6;

      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      rec.items.forEach(item => {
        this.doc.text(`• ${item}`, 25, this.currentY);
        this.currentY += 5;
      });

      this.currentY += 5;
    });
  }

  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Add page number
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      
      // Add company info
      this.doc.text('LeapScholar Brand Intelligence Dashboard', 20, 290);
      this.doc.text('Confidential Report', 170, 290);
    }
  }

  addSectionTitle(title, x) {
    // Check if we need a new page
    if (this.currentY > 250) {
      this.doc.addPage();
      this.currentY = 20;
    }

    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(title, x, this.currentY);
    
    // Add decorative line
    this.doc.setDrawColor(59, 130, 246);
    this.doc.setLineWidth(0.5);
    this.doc.line(x, this.currentY + 2, x + 50, this.currentY + 2);
    
    this.currentY += 10;
  }

  getTrendIcon(trend) {
    switch (trend) {
      case 'up': return '↗️ Rising';
      case 'down': return '↘️ Declining';
      default: return '→ Stable';
    }
  }

  getTopicInsight(topic) {
    if (topic.trend === 'up') {
      return 'Growing interest - capitalize on trend';
    } else if (topic.trend === 'down') {
      return 'Declining mentions - investigate cause';
    } else {
      return 'Stable topic - maintain strategy';
    }
  }

  getSentimentBadge(sentiment) {
    switch (sentiment) {
      case 'positive': return '✅ Positive';
      case 'negative': return '❌ Negative';
      default: return '➖ Neutral';
    }
  }

  getCompetitorSentiment(name, sentimentData) {
    const competitor = sentimentData?.find(comp => comp.name === name);
    return competitor ? `${competitor.positive}%` : 'N/A';
  }

  cleanText(text, maxLength) {
    if (!text) return '';
    
    // Remove special characters and clean the text
    let cleaned = text
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters except basic punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    // Truncate if too long
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

export default PDFGenerator; 
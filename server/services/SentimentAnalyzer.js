const natural = require('natural');
const nlp = require('compromise');
const moment = require('moment');

class SentimentAnalyzer {
  constructor() {
    this.initializeAnalyzer();
    this.sentimentKeywords = {
      positive: [
        'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'outstanding',
        'helpful', 'supportive', 'reliable', 'trustworthy', 'professional',
        'smooth', 'easy', 'quick', 'fast', 'efficient', 'satisfied', 'happy',
        'recommend', 'love', 'like', 'good', 'best', 'perfect', 'awesome',
        'successful', 'approved', 'approved', 'helpful', 'informative'
      ],
      negative: [
        'bad', 'terrible', 'awful', 'horrible', 'disappointing', 'frustrating',
        'difficult', 'slow', 'delayed', 'unresponsive', 'confusing', 'complicated',
        'expensive', 'costly', 'hidden fees', 'scam', 'fraud', 'unreliable',
        'untrustworthy', 'unprofessional', 'rude', 'unhelpful', 'useless',
        'waste', 'regret', 'avoid', 'never', 'worst', 'problem', 'issue',
        'delay', 'rejection', 'denied', 'failed', 'error', 'bug'
      ],
      neutral: [
        'okay', 'fine', 'average', 'normal', 'standard', 'regular',
        'question', 'ask', 'wonder', 'consider', 'thinking', 'maybe',
        'information', 'details', 'process', 'procedure', 'requirement'
      ]
    };

    this.brandKeywords = {
      'LeapScholar': ['leapscholar', 'leap scholar', 'leapfinance'],
      'MPOWER': ['mpower', 'm-power'],
      'Prodigy Finance': ['prodigy finance', 'prodigy'],
      'IDP': ['idp'],
      'KC Overseas': ['kc overseas', 'kc']
    };

    this.impactFactors = {
      followerCount: 0.3,
      engagement: 0.4,
      platform: 0.2,
      sentiment: 0.1
    };
  }

  initializeAnalyzer() {
    // Initialize natural language processing
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    
    // Create sentiment classifier
    this.classifier = new natural.BayesClassifier();
    
    // Train the classifier with sample data
    this.trainClassifier();
  }

  trainClassifier() {
    // Train with positive examples
    this.sentimentKeywords.positive.forEach(word => {
      this.classifier.addDocument(word, 'positive');
    });

    // Train with negative examples
    this.sentimentKeywords.negative.forEach(word => {
      this.classifier.addDocument(word, 'negative');
    });

    // Train with neutral examples
    this.sentimentKeywords.neutral.forEach(word => {
      this.classifier.addDocument(word, 'neutral');
    });

    // Train with common phrases
    const positivePhrases = [
      'great service', 'excellent support', 'highly recommend', 'very helpful',
      'smooth process', 'quick approval', 'professional team', 'trustworthy company',
      'satisfied customer', 'amazing experience', 'outstanding service'
    ];

    const negativePhrases = [
      'terrible service', 'poor support', 'not recommend', 'very unhelpful',
      'complicated process', 'slow approval', 'unprofessional team', 'untrustworthy company',
      'dissatisfied customer', 'bad experience', 'awful service', 'hidden fees',
      'delayed processing', 'unresponsive customer service'
    ];

    const neutralPhrases = [
      'need information', 'asking about', 'considering options', 'looking for',
      'process details', 'requirements', 'documentation needed', 'application process'
    ];

    positivePhrases.forEach(phrase => this.classifier.addDocument(phrase, 'positive'));
    negativePhrases.forEach(phrase => this.classifier.addDocument(phrase, 'negative'));
    neutralPhrases.forEach(phrase => this.classifier.addDocument(phrase, 'neutral'));

    this.classifier.train();
  }

  async analyzeSentiments(conversations) {
    const analyzedConversations = [];
    const sentimentStats = {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: conversations.length
    };

    for (const conversation of conversations) {
      const analysis = await this.analyzeConversation(conversation);
      analyzedConversations.push(analysis);
      
      sentimentStats[analysis.sentiment]++;
    }

    return {
      conversations: analyzedConversations,
      stats: sentimentStats,
      breakdown: this.calculateSentimentBreakdown(sentimentStats)
    };
  }

  async analyzeConversation(conversation) {
    const text = conversation.content.toLowerCase();
    const tokens = this.tokenizer.tokenize(text);
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));

    // Basic sentiment classification
    const sentiment = this.classifier.classify(text);
    
    // Confidence score
    const confidence = this.calculateConfidence(text, sentiment);
    
    // Impact score calculation
    const impactScore = this.calculateImpactScore(conversation, sentiment, confidence);
    
    // Brand mentions detection
    const brandMentions = this.detectBrandMentions(text);
    
    // Urgency detection
    const urgency = this.detectUrgency(text);
    
    // Topic extraction
    const topics = this.extractTopics(text);

    return {
      ...conversation,
      sentiment: sentiment,
      confidence: confidence,
      impactScore: impactScore,
      brandMentions: brandMentions,
      urgency: urgency,
      topics: topics,
      analyzedAt: new Date().toISOString()
    };
  }

  calculateConfidence(text, sentiment) {
    const words = text.toLowerCase().split(' ');
    let sentimentWordCount = 0;
    let totalSentimentWords = 0;

    // Count sentiment words
    Object.values(this.sentimentKeywords).flat().forEach(word => {
      if (words.includes(word)) {
        sentimentWordCount++;
      }
    });

    // Count total sentiment words in text
    words.forEach(word => {
      if (Object.values(this.sentimentKeywords).flat().includes(word)) {
        totalSentimentWords++;
      }
    });

    if (totalSentimentWords === 0) return 0.5; // Neutral confidence if no sentiment words

    return Math.min(1.0, sentimentWordCount / totalSentimentWords + 0.3);
  }

  calculateImpactScore(conversation, sentiment, confidence) {
    let score = 0;

    // Follower count impact (0-30 points)
    const followerScore = Math.min(30, Math.log10(conversation.followers + 1) * 10);
    score += followerScore * this.impactFactors.followerCount;

    // Engagement impact (0-40 points)
    const engagementScore = Math.min(40, Math.log10(conversation.engagement + 1) * 8);
    score += engagementScore * this.impactFactors.engagement;

    // Platform impact (0-20 points)
    const platformScores = {
      'Twitter': 20,
      'LinkedIn': 18,
      'Reddit': 15,
      'YouTube': 12,
      'Quora': 10
    };
    const platformScore = platformScores[conversation.platform] || 10;
    score += platformScore * this.impactFactors.platform;

    // Sentiment impact (0-10 points)
    const sentimentScores = {
      'negative': 10,
      'positive': 5,
      'neutral': 2
    };
    const sentimentScore = sentimentScores[sentiment] || 2;
    score += sentimentScore * this.impactFactors.sentiment * confidence;

    // Urgency bonus
    if (conversation.urgency === 'high') {
      score += 10;
    } else if (conversation.urgency === 'medium') {
      score += 5;
    }

    return Math.round(Math.min(100, score));
  }

  detectBrandMentions(text) {
    const mentions = [];
    const lowerText = text.toLowerCase();

    for (const [brand, keywords] of Object.entries(this.brandKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          mentions.push({
            brand: brand,
            keyword: keyword,
            context: this.extractContext(text, keyword)
          });
        }
      }
    }

    return mentions;
  }

  detectUrgency(text) {
    const urgentWords = [
      'urgent', 'emergency', 'immediately', 'asap', 'critical', 'important',
      'help needed', 'support needed', 'issue', 'problem', 'error', 'failed',
      'rejection', 'denied', 'delay', 'stuck', 'blocked', 'urgently'
    ];

    const urgentCount = urgentWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    ).length;

    if (urgentCount >= 2) return 'high';
    if (urgentCount >= 1) return 'medium';
    return 'low';
  }

  extractTopics(text) {
    const topics = [];
    const lowerText = text.toLowerCase();

    // Education-related topics
    if (lowerText.includes('study abroad') || lowerText.includes('international student')) {
      topics.push('Study Abroad');
    }
    if (lowerText.includes('loan') || lowerText.includes('finance') || lowerText.includes('funding')) {
      topics.push('Student Loans');
    }
    if (lowerText.includes('visa') || lowerText.includes('immigration')) {
      topics.push('Visa & Immigration');
    }
    if (lowerText.includes('ielts') || lowerText.includes('toefl') || lowerText.includes('english test')) {
      topics.push('English Tests');
    }
    if (lowerText.includes('counseling') || lowerText.includes('consultation')) {
      topics.push('Counseling');
    }
    if (lowerText.includes('university') || lowerText.includes('college') || lowerText.includes('institution')) {
      topics.push('Universities');
    }

    return topics;
  }

  extractContext(text, keyword) {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return '';

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + keyword.length + 50);
    return text.substring(start, end).trim();
  }

  calculateSentimentBreakdown(stats) {
    const total = stats.total;
    if (total === 0) return [];

    return [
      {
        name: 'Positive',
        value: Math.round((stats.positive / total) * 100),
        color: '#22c55e'
      },
      {
        name: 'Neutral',
        value: Math.round((stats.neutral / total) * 100),
        color: '#6b7280'
      },
      {
        name: 'Negative',
        value: Math.round((stats.negative / total) * 100),
        color: '#ef4444'
      }
    ];
  }

  async getTrends(days = 30) {
    // This would typically query a database for historical sentiment data
    // For now, we'll generate sample trend data
    const trends = [];
    const now = moment();

    for (let i = days; i >= 0; i--) {
      const date = now.clone().subtract(i, 'days');
      trends.push({
        date: date.format('YYYY-MM-DD'),
        positive: Math.floor(Math.random() * 30) + 60, // 60-90%
        neutral: Math.floor(Math.random() * 20) + 10,  // 10-30%
        negative: Math.floor(Math.random() * 15) + 5   // 5-20%
      });
    }

    return trends;
  }

  getSentimentSummary(conversations) {
    const summary = {
      totalConversations: conversations.length,
      sentimentDistribution: {
        positive: 0,
        neutral: 0,
        negative: 0
      },
      averageImpactScore: 0,
      criticalAlerts: 0,
      trendingTopics: []
    };

    let totalImpactScore = 0;

    conversations.forEach(conversation => {
      summary.sentimentDistribution[conversation.sentiment]++;
      totalImpactScore += conversation.impactScore;

      if (conversation.impactScore >= 80) {
        summary.criticalAlerts++;
      }
    });

    summary.averageImpactScore = Math.round(totalImpactScore / conversations.length);

    // Extract trending topics
    const topicCounts = {};
    conversations.forEach(conversation => {
      conversation.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    summary.trendingTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    return summary;
  }
}

module.exports = SentimentAnalyzer; 
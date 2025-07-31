class ConversationService {
  constructor() {
    this.savedComments = this.loadSavedComments();
    this.linkStats = this.loadLinkStats();
  }

  // Saved Comments Management
  loadSavedComments() {
    try {
      const saved = localStorage.getItem('savedComments');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved comments:', error);
      return [];
    }
  }

  saveComment(comment) {
    const savedComment = {
      ...comment,
      savedAt: new Date().toISOString(),
      id: comment.id || `saved_${Date.now()}`
    };
    
    this.savedComments = [savedComment, ...this.savedComments];
    this.persistSavedComments();
    return savedComment;
  }

  removeSavedComment(commentId) {
    this.savedComments = this.savedComments.filter(c => c.id !== commentId);
    this.persistSavedComments();
  }

  isCommentSaved(commentId) {
    return this.savedComments.some(c => c.id === commentId);
  }

  persistSavedComments() {
    try {
      localStorage.setItem('savedComments', JSON.stringify(this.savedComments));
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  }

  // Link Tracking
  loadLinkStats() {
    try {
      const stats = localStorage.getItem('linkStats');
      return stats ? JSON.parse(stats) : {
        reddit: { clicks: 0, lastClicked: null },
        twitter: { clicks: 0, lastClicked: null },
        quora: { clicks: 0, lastClicked: null },
        linkedin: { clicks: 0, lastClicked: null },
        youtube: { clicks: 0, lastClicked: null },
        instagram: { clicks: 0, lastClicked: null }
      };
    } catch (error) {
      console.error('Error loading link stats:', error);
      return {};
    }
  }

  trackLinkClick(platform) {
    if (!this.linkStats[platform]) {
      this.linkStats[platform] = { clicks: 0, lastClicked: null };
    }
    
    this.linkStats[platform].clicks += 1;
    this.linkStats[platform].lastClicked = new Date().toISOString();
    this.persistLinkStats();
  }

  persistLinkStats() {
    try {
      localStorage.setItem('linkStats', JSON.stringify(this.linkStats));
    } catch (error) {
      console.error('Error saving link stats:', error);
    }
  }

  // Share Link Generation
  generateShareLink(comment) {
    const baseUrl = window.location.origin;
    const shareData = {
      id: comment.id,
      author: comment.author,
      platform: comment.platform,
      content: comment.content.substring(0, 100) + '...',
      sentiment: comment.sentiment,
      impactScore: comment.impactScore
    };
    
    const encodedData = btoa(JSON.stringify(shareData));
    return `${baseUrl}/share/${encodedData}`;
  }

  // Platform-specific dummy links
  getPlatformLinks() {
    return {
      reddit: {
        url: 'https://reddit.com/r/studyabroad',
        name: 'Reddit',
        icon: '🔴',
        description: 'Study Abroad Community',
        logo: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png'
      },
      twitter: {
        url: 'https://twitter.com/LeapScholar',
        name: 'Twitter',
        icon: '🐦',
        description: 'Official Twitter',
        logo: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png'
      },
      quora: {
        url: 'https://quora.com/topic/LeapScholar',
        name: 'Quora',
        icon: '❓',
        description: 'Q&A Platform',
        logo: 'https://qsf.fs.quoracdn.net/-4-images.favicon.ico-26-ae77b637b1e7ed2c.ico'
      },
      linkedin: {
        url: 'https://linkedin.com/company/leapscholar',
        name: 'LinkedIn',
        icon: '💼',
        description: 'Professional Network',
        logo: 'https://static.licdn.com/sc/h/akt4ae504epesldzj74dzred8'
      },
      youtube: {
        url: 'https://youtube.com/@LeapScholar',
        name: 'YouTube',
        icon: '📺',
        description: 'Video Content',
        logo: 'https://www.youtube.com/s/desktop/12d6b690/img/favicon_144x144.png'
      },
      instagram: {
        url: 'https://instagram.com/leapscholar',
        name: 'Instagram',
        icon: '📷',
        description: 'Visual Stories',
        logo: 'https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png'
      }
    };
  }

  // Get conversation statistics
  getConversationStats(conversations) {
    const stats = {
      total: conversations.length,
      positive: conversations.filter(c => c.sentiment === 'positive').length,
      negative: conversations.filter(c => c.sentiment === 'negative').length,
      neutral: conversations.filter(c => c.sentiment === 'neutral').length,
      avgImpact: Math.round(conversations.reduce((sum, c) => sum + c.impactScore, 0) / conversations.length),
      platformBreakdown: {},
      savedCount: this.savedComments.length
    };

    // Platform breakdown
    conversations.forEach(conv => {
      if (!stats.platformBreakdown[conv.platform]) {
        stats.platformBreakdown[conv.platform] = 0;
      }
      stats.platformBreakdown[conv.platform]++;
    });

    return stats;
  }
}

const conversationService = new ConversationService();
export default conversationService; 
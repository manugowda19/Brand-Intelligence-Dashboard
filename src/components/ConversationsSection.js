import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  ExternalLink,
  Search,
  Bookmark
} from 'lucide-react';
import conversationService from '../services/conversationService';

const ConversationsSection = ({ data, onShowSavedComments }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const saved = conversationService.loadSavedComments();
    setSavedCount(saved.length);
  }, []);

  if (!data) return null;

  const getPlatformIcon = (platform) => {
    const platformColors = {
      'Reddit': 'text-orange-600',
      'Twitter': 'text-blue-500',
      'Quora': 'text-red-600',
      'LinkedIn': 'text-blue-700',
      'YouTube': 'text-red-500',
      'Instagram': 'text-pink-600'
    };
    return platformColors[platform] || 'text-gray-600';
  };

  const getSentimentBadge = (sentiment) => {
    const styles = {
      positive: 'bg-success-100 text-success-800 border-success-200',
      negative: 'bg-danger-100 text-danger-800 border-danger-200',
      neutral: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[sentiment] || styles.neutral;
  };

  const getImpactScoreColor = (score) => {
    if (score >= 80) return 'text-danger-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-success-600';
  };

  const filteredConversations = data
    .filter(conversation => {
      if (filter !== 'all' && conversation.sentiment !== filter) return false;
      if (searchTerm && !conversation.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.impactScore - a.impactScore);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Significant Conversations</h2>
          {savedCount > 0 && (
            <button
              onClick={onShowSavedComments}
              className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span className="text-sm font-medium">{savedCount} Saved</span>
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${
              conversation.sentiment === 'negative' 
                ? 'border-danger-200 bg-danger-50' 
                : conversation.sentiment === 'positive'
                ? 'border-success-200 bg-success-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-full bg-white ${getPlatformIcon(conversation.platform)}`}>
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{conversation.author}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{conversation.platform}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(parseISO(conversation.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {conversation.followers.toLocaleString()} followers
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {conversation.engagement} engagement
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {conversation.content}
                </p>

                {/* Tags and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSentimentBadge(conversation.sentiment)}`}>
                      {conversation.sentiment.charAt(0).toUpperCase() + conversation.sentiment.slice(1)}
                    </span>
                    <span className={`text-xs font-medium ${getImpactScoreColor(conversation.impactScore)}`}>
                      Impact: {conversation.impactScore}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      className={`p-1 transition-colors ${
                        conversationService.isCommentSaved(conversation.id)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      onClick={() => {
                        if (conversationService.isCommentSaved(conversation.id)) {
                          conversationService.removeSavedComment(conversation.id);
                          alert(`💔 Removed from saved comments`);
                        } else {
                          conversationService.saveComment(conversation);
                          alert(`❤️ Saved conversation by ${conversation.author}`);
                        }
                        // Update saved count
                        const saved = conversationService.loadSavedComments();
                        setSavedCount(saved.length);
                      }}
                      title={conversationService.isCommentSaved(conversation.id) ? "Remove from Saved" : "Save Comment"}
                    >
                      <Heart className={`w-4 h-4 ${conversationService.isCommentSaved(conversation.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => {
                        const shareLink = conversationService.generateShareLink(conversation);
                        navigator.clipboard.writeText(shareLink);
                        alert('🔗 Share link copied to clipboard!');
                      }}
                      title="Generate Share Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => {
                        // Track link click for the platform
                        conversationService.trackLinkClick(conversation.platform.toLowerCase());
                        window.open(conversation.url || '#', '_blank');
                      }}
                      title="Open Original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            <p className="text-sm text-gray-600">Total Conversations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">
              {data.filter(c => c.sentiment === 'positive').length}
            </p>
            <p className="text-sm text-gray-600">Positive</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger-600">
              {data.filter(c => c.sentiment === 'negative').length}
            </p>
            <p className="text-sm text-gray-600">Negative</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {Math.round(data.reduce((sum, c) => sum + c.impactScore, 0) / data.length)}
            </p>
            <p className="text-sm text-gray-600">Avg Impact Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsSection; 
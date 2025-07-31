import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { 
  MessageCircle, 
  Share2, 
  ExternalLink,
  Search,
  Trash2,
  ArrowLeft,
  Filter,
  Bookmark
} from 'lucide-react';
import conversationService from '../services/conversationService';

const SavedCommentsPage = ({ onBack }) => {
  const [savedComments, setSavedComments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('savedAt');

  useEffect(() => {
    loadSavedComments();
  }, []);

  const loadSavedComments = () => {
    const saved = conversationService.loadSavedComments();
    setSavedComments(saved);
  };

  const removeSavedComment = (commentId) => {
    conversationService.removeSavedComment(commentId);
    loadSavedComments();
  };

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

  const filteredAndSortedComments = savedComments
    .filter(comment => {
      if (filter !== 'all' && comment.sentiment !== filter) return false;
      if (searchTerm && !comment.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'savedAt':
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'impactScore':
          return b.impactScore - a.impactScore;
        case 'author':
          return a.author.localeCompare(b.author);
        case 'platform':
          return a.platform.localeCompare(b.platform);
        default:
          return 0;
      }
    });

  const stats = {
    total: savedComments.length,
    positive: savedComments.filter(c => c.sentiment === 'positive').length,
    negative: savedComments.filter(c => c.sentiment === 'negative').length,
    neutral: savedComments.filter(c => c.sentiment === 'neutral').length,
    platforms: Object.keys(savedComments.reduce((acc, c) => {
      acc[c.platform] = (acc[c.platform] || 0) + 1;
      return acc;
    }, {}))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Saved Comments</h1>
                <p className="text-sm text-gray-600">Your bookmarked conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bookmark className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900">{savedComments.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Saved</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-success-600">{stats.positive}</p>
            <p className="text-sm text-gray-600">Positive</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-danger-600">{stats.negative}</p>
            <p className="text-sm text-gray-600">Negative</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.platforms.length}</p>
            <p className="text-sm text-gray-600">Platforms</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
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

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="savedAt">Saved Date</option>
                <option value="impactScore">Impact Score</option>
                <option value="author">Author</option>
                <option value="platform">Platform</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredAndSortedComments.length === 0 ? (
            <div className="card text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved comments</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' 
                  ? 'No comments match your current filters.' 
                  : 'Start saving comments by clicking the heart icon on any conversation.'}
              </p>
            </div>
          ) : (
            filteredAndSortedComments.map((comment) => (
              <div
                key={comment.id}
                className={`card transition-all hover:shadow-md ${
                  comment.sentiment === 'negative' 
                    ? 'border-danger-200 bg-danger-50' 
                    : comment.sentiment === 'positive'
                    ? 'border-success-200 bg-success-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full bg-white ${getPlatformIcon(comment.platform)}`}>
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{comment.platform}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            Saved {formatDistanceToNow(parseISO(comment.savedAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {comment.followers?.toLocaleString()} followers
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {comment.engagement} engagement
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Tags and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSentimentBadge(comment.sentiment)}`}>
                          {comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}
                        </span>
                        <span className={`text-xs font-medium ${getImpactScoreColor(comment.impactScore)}`}>
                          Impact: {comment.impactScore}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => {
                            const shareLink = conversationService.generateShareLink(comment);
                            navigator.clipboard.writeText(shareLink);
                            alert('🔗 Share link copied to clipboard!');
                          }}
                          title="Share Link"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => {
                            window.open(comment.url || '#', '_blank');
                          }}
                          title="Open Original"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          onClick={() => {
                            if (window.confirm('Remove this comment from saved?')) {
                              removeSavedComment(comment.id);
                            }
                          }}
                          title="Remove from Saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedCommentsPage; 
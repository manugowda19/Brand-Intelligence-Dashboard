import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, MessageCircle, Activity } from 'lucide-react';

const OverviewSection = ({ data }) => {
  if (!data) return null;

  const getSentimentColor = (score) => {
    if (score >= 70) return 'text-success-600';
    if (score >= 50) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getSentimentBgColor = (score) => {
    if (score >= 70) return 'bg-success-50';
    if (score >= 50) return 'bg-warning-50';
    return 'bg-danger-50';
  };

  const getSentimentBorderColor = (score) => {
    if (score >= 70) return 'border-success-200';
    if (score >= 50) return 'border-warning-200';
    return 'border-danger-200';
  };

  const getMentionsChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-danger-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getMentionsChangeColor = (change) => {
    if (change > 0) return 'text-success-600';
    if (change < 0) return 'text-danger-600';
    return 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Sentiment Score */}
      <div className={`metric-card ${getSentimentBgColor(data.sentimentScore)} ${getSentimentBorderColor(data.sentimentScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Sentiment Score</p>
            <p className={`text-3xl font-bold ${getSentimentColor(data.sentimentScore)}`}>
              {data.sentimentScore}
            </p>
            <p className="text-xs text-gray-500 mt-1">out of 100</p>
          </div>
          <div className={`p-3 rounded-full ${getSentimentBgColor(data.sentimentScore)}`}>
            <Activity className={`w-6 h-6 ${getSentimentColor(data.sentimentScore)}`} />
          </div>
        </div>
      </div>

      {/* Total Mentions */}
      <div className="metric-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Mentions</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalMentions.toLocaleString()}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              {getMentionsChangeIcon(data.mentionsChange)}
              <span className={`text-xs font-medium ${getMentionsChangeColor(data.mentionsChange)}`}>
                {data.mentionsChange > 0 ? '+' : ''}{data.mentionsChange}%
              </span>
              <span className="text-xs text-gray-500">vs yesterday</span>
            </div>
          </div>
          <div className="p-3 rounded-full bg-primary-50">
            <MessageCircle className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className={`metric-card ${data.criticalAlerts > 0 ? 'alert-critical' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
            <p className={`text-3xl font-bold ${data.criticalAlerts > 0 ? 'text-danger-600' : 'text-gray-900'}`}>
              {data.criticalAlerts}
            </p>
            <p className="text-xs text-gray-500 mt-1">need attention</p>
          </div>
          <div className={`p-3 rounded-full ${data.criticalAlerts > 0 ? 'bg-danger-100' : 'bg-gray-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${data.criticalAlerts > 0 ? 'text-danger-600' : 'text-gray-600'}`} />
          </div>
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="metric-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Platforms</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-500 mt-1">monitored</p>
          </div>
          <div className="p-3 rounded-full bg-success-50">
            <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection; 
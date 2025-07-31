import React from 'react';
import { TrendingUp, TrendingDown, Minus, Hash, MessageSquare } from 'lucide-react';

const TrendsSection = ({ data }) => {
  if (!data) return null;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-danger-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  const getFontSize = (count) => {
    if (count >= 40) return 'text-2xl font-bold';
    if (count >= 30) return 'text-xl font-semibold';
    if (count >= 20) return 'text-lg font-medium';
    return 'text-base';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Emerging Topics & Trends</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Hash className="w-4 h-4" />
          <span>Last 24 hours</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trending Topics</h3>
          <div className="space-y-3">
            {data.topics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`${getFontSize(topic.count)} text-gray-900`}>
                    {topic.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {topic.count} mentions
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(topic.trend)}
                  <span className={`text-xs font-medium ${getTrendColor(topic.trend)}`}>
                    {topic.trend === 'up' ? 'Rising' : topic.trend === 'down' ? 'Declining' : 'Stable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Questions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trending Questions</h3>
          <div className="space-y-3">
            {data.questions.map((question, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Cloud Visualization */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Topic Cloud</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {data.topics.map((topic, index) => (
            <span
              key={index}
              className={`${getFontSize(topic.count)} px-3 py-1 rounded-full ${
                topic.trend === 'up' 
                  ? 'bg-success-100 text-success-800' 
                  : topic.trend === 'down' 
                  ? 'bg-danger-100 text-danger-800' 
                  : 'bg-gray-100 text-gray-800'
              } hover:scale-105 transition-transform cursor-pointer`}
              title={`${topic.count} mentions - ${topic.trend} trend`}
            >
              {topic.name}
            </span>
          ))}
        </div>
      </div>

      {/* Insights Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
            <h4 className="font-medium text-success-800 mb-1">Positive Trends</h4>
            <p className="text-sm text-success-700">
              Strong interest in Canada, AI/ML programs, and scholarship opportunities
            </p>
          </div>
          <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <h4 className="font-medium text-warning-800 mb-1">Areas to Monitor</h4>
            <p className="text-sm text-warning-700">
              Loan service mentions declining, need to address processing delays
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsSection; 
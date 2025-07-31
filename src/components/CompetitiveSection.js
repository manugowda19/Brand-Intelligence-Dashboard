import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CompetitiveSection = ({ data }) => {
  if (!data) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value} mentions ({entry.payload.percentage}%)
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const SentimentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-success-600">Positive: {payload[0].value}%</p>
          <p className="text-sm text-gray-600">Neutral: {payload[1].value}%</p>
          <p className="text-sm text-danger-600">Negative: {payload[2].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Competitive Analysis</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Share of Voice & Sentiment Comparison</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share of Voice */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Share of Voice (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.shareOfVoice} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mentions" radius={[0, 4, 4, 0]}>
                  {data.shareOfVoice.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Share of Voice Summary */}
          <div className="mt-4 space-y-2">
            {data.shareOfVoice.map((competitor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{competitor.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{competitor.mentions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{competitor.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Comparison */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sentimentComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<SentimentTooltip />} />
                <Bar dataKey="positive" stackId="a" fill="#22c55e" radius={[4, 0, 0, 4]} />
                <Bar dataKey="neutral" stackId="a" fill="#6b7280" />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Sentiment Summary */}
          <div className="mt-4 space-y-2">
            {data.sentimentComparison.map((competitor, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{competitor.name}</span>
                  <span className="text-xs text-gray-500">Net Sentiment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-success-500 h-2 rounded-full" 
                      style={{ width: `${competitor.positive}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-success-600">{competitor.positive}%</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <span>Neutral: {competitor.neutral}%</span>
                  <span>Negative: {competitor.negative}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitive Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Competitive Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
            <h4 className="font-medium text-success-800 mb-2">Market Position</h4>
            <p className="text-sm text-success-700">
              LeapScholar leads with 35% share of voice, significantly ahead of MPOWER (25%) and Prodigy Finance (21%).
            </p>
          </div>
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <h4 className="font-medium text-primary-800 mb-2">Sentiment Advantage</h4>
            <p className="text-sm text-primary-700">
              Highest positive sentiment at 78%, outperforming all competitors in customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveSection; 
import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

const SentimentSection = ({ data }) => {
  if (!data) return null;

  const COLORS = ['#22c55e', '#6b7280', '#ef4444'];

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMM dd');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sentiment Analysis</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Positive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Neutral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Negative</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Sentiment Breakdown Pie Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Trend Line Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">30-Day Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="neutral" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#6b7280', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">
              {data.breakdown.find(item => item.name === 'Positive')?.value || 0}%
            </p>
            <p className="text-sm text-gray-600">Positive Sentiment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {data.breakdown.find(item => item.name === 'Neutral')?.value || 0}%
            </p>
            <p className="text-sm text-gray-600">Neutral Sentiment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger-600">
              {data.breakdown.find(item => item.name === 'Negative')?.value || 0}%
            </p>
            <p className="text-sm text-gray-600">Negative Sentiment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentSection; 
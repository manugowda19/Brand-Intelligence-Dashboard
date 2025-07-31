import axios from 'axios';

// Mock data for development - replace with actual API endpoints
const mockDashboardData = {
  overview: {
    sentimentScore: 78,
    totalMentions: 1247,
    mentionsChange: 15.3,
    criticalAlerts: 3,
    lastUpdated: new Date().toISOString()
  },
  sentiment: {
    breakdown: [
      { name: 'Positive', value: 65, color: '#22c55e' },
      { name: 'Neutral', value: 25, color: '#6b7280' },
      { name: 'Negative', value: 10, color: '#ef4444' }
    ],
    trend: [
      { date: '2024-01-01', positive: 60, neutral: 30, negative: 10 },
      { date: '2024-01-02', positive: 62, neutral: 28, negative: 10 },
      { date: '2024-01-03', positive: 65, neutral: 25, negative: 10 },
      { date: '2024-01-04', positive: 63, neutral: 27, negative: 10 },
      { date: '2024-01-05', positive: 68, neutral: 22, negative: 10 },
      { date: '2024-01-06', positive: 70, neutral: 20, negative: 10 },
      { date: '2024-01-07', positive: 78, neutral: 15, negative: 7 }
    ]
  },
  trends: {
    topics: [
      { name: 'Canada', count: 45, trend: 'up' },
      { name: 'Student Visa', count: 38, trend: 'up' },
      { name: 'IELTS', count: 32, trend: 'stable' },
      { name: 'Loan Service', count: 28, trend: 'down' },
      { name: 'AI/ML', count: 25, trend: 'up' },
      { name: 'Scholarship', count: 22, trend: 'up' },
      { name: 'Delay', count: 18, trend: 'down' },
      { name: 'Counseling', count: 15, trend: 'stable' }
    ],
    questions: [
      "Is LeapScholar's loan service reliable for international students?",
      "How does LeapScholar compare to MPOWER for student loans?",
      "What are the current processing times for LeapScholar loans?",
      "Does LeapScholar offer counseling for Canada student visas?",
      "Are there any hidden fees with LeapScholar's services?"
    ]
  },
  conversations: [
    {
      id: 1,
      platform: 'Reddit',
      author: 'StudentAbroad2024',
      content: "Just got approved for my LeapScholar loan! The process was smooth and their customer service was incredibly helpful. Highly recommend for anyone looking to study in Canada.",
      sentiment: 'positive',
      impactScore: 85,
      engagement: 23,
      timestamp: '2024-01-07T10:30:00Z',
      followers: 1200,
      url: 'https://reddit.com/r/studyabroad/comments/example1'
    },
    {
      id: 2,
      platform: 'Twitter',
      author: 'StudyAbroadGuru',
      content: "🚨 URGENT: Multiple students reporting delays with @LeapScholar loan processing. Anyone else experiencing this? #StudyAbroad #StudentLoans",
      sentiment: 'negative',
      impactScore: 92,
      engagement: 156,
      timestamp: '2024-01-07T09:15:00Z',
      followers: 25000,
      url: 'https://twitter.com/StudyAbroadGuru/status/example2'
    },
    {
      id: 3,
      platform: 'Quora',
      author: 'InternationalStudent',
      content: "I'm considering LeapScholar for my MS in AI/ML. Their counseling session was informative, but I'm concerned about the interest rates. Can anyone share their experience?",
      sentiment: 'neutral',
      impactScore: 67,
      engagement: 8,
      timestamp: '2024-01-07T08:45:00Z',
      followers: 500,
      url: 'https://quora.com/example-question-3'
    },
    {
      id: 4,
      platform: 'LinkedIn',
      author: 'Education Consultant',
      content: "Excited to partner with LeapScholar for our student visa counseling services. Their expertise in the Canadian education market is unmatched!",
      sentiment: 'positive',
      impactScore: 78,
      engagement: 45,
      timestamp: '2024-01-07T07:30:00Z',
      followers: 3500,
      url: 'https://linkedin.com/posts/education-consultant-example4'
    },
    {
      id: 5,
      platform: 'YouTube',
      author: 'StudentVlogger',
      content: "LeapScholar helped me get my student visa in just 2 weeks! Here's my complete experience and tips for future students.",
      sentiment: 'positive',
      impactScore: 89,
      engagement: 234,
      timestamp: '2024-01-07T06:20:00Z',
      followers: 15000,
      url: 'https://youtube.com/watch?v=example5'
    },
    {
      id: 6,
      platform: 'Instagram',
      author: 'StudyAbroadDiaries',
      content: "Just posted my LeapScholar journey highlights! From application to visa approval in 3 weeks. Their team was amazing throughout the process. #StudyAbroad #LeapScholar #Canada",
      sentiment: 'positive',
      impactScore: 76,
      engagement: 189,
      timestamp: '2024-01-07T05:45:00Z',
      followers: 8500,
      url: 'https://instagram.com/p/example6'
    }
  ],
  competitive: {
    shareOfVoice: [
      { name: 'LeapScholar', mentions: 1247, percentage: 35 },
      { name: 'MPOWER', mentions: 892, percentage: 25 },
      { name: 'Prodigy Finance', mentions: 756, percentage: 21 },
      { name: 'IDP', mentions: 445, percentage: 12 },
      { name: 'KC Overseas', mentions: 234, percentage: 7 }
    ],
    sentimentComparison: [
      { name: 'LeapScholar', positive: 78, neutral: 15, negative: 7 },
      { name: 'MPOWER', positive: 72, neutral: 20, negative: 8 },
      { name: 'Prodigy Finance', positive: 68, neutral: 25, negative: 7 },
      { name: 'IDP', positive: 65, neutral: 28, negative: 7 },
      { name: 'KC Overseas', positive: 62, neutral: 30, negative: 8 }
    ]
  }
};

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const fetchDashboardData = async () => {
  try {
    // Use real API when available, fallback to mock data
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data:', error.message);
    // Fallback to mock data for development
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockDashboardData;
  }
};

export const fetchSentimentTrends = async (days = 30) => {
  try {
    const response = await api.get(`/sentiment/trends?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sentiment trends:', error);
    throw error;
  }
};

export const fetchConversations = async (filters = {}) => {
  try {
    const response = await api.get('/conversations', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchCompetitiveData = async () => {
  try {
    const response = await api.get('/competitive');
    return response.data;
  } catch (error) {
    console.error('Error fetching competitive data:', error);
    throw error;
  }
};

export const exportReport = async (format = 'pdf') => {
  try {
    const response = await api.get(`/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
};

export default api; 
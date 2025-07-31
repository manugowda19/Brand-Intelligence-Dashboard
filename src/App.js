import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewSection from './components/OverviewSection';
import SentimentSection from './components/SentimentSection';
import TrendsSection from './components/TrendsSection';
import ConversationsSection from './components/ConversationsSection';
import CompetitiveSection from './components/CompetitiveSection';
import PlatformLinksSection from './components/PlatformLinksSection';
import SavedCommentsPage from './components/SavedCommentsPage';
import { fetchDashboardData } from './services/api';
import socketService from './services/socket';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'saved'

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Initialize real-time connection
    socketService.connect();
    
    // Listen for real-time updates
    socketService.on('dashboard-update', (data) => {
      console.log('📊 Real-time dashboard update received');
      setDashboardData(data);
    });

    socketService.on('critical-alerts', (alerts) => {
      console.log('🚨 Critical alerts received:', alerts);
      // You can show a notification here
      if (alerts.length > 0) {
        showCriticalAlertNotification(alerts);
      }
    });

    socketService.on('daily-summary', (summary) => {
      console.log('📋 Daily summary received:', summary);
      // You can show a notification here
      showDailySummaryNotification(summary);
    });

    // Update connection status
    const updateConnectionStatus = () => {
      const status = socketService.getConnectionStatus();
      // Show as "Live" when using mock data (backend not running)
      if (!status.isConnected && dashboardData) {
        setConnectionStatus({ isConnected: true, usingMockData: true });
      } else {
        setConnectionStatus(status);
      }
    };

    // Check connection status every 5 seconds
    const statusInterval = setInterval(updateConnectionStatus, 5000);
    updateConnectionStatus(); // Initial check

    // Cleanup
    return () => {
      clearInterval(statusInterval);
      socketService.disconnect();
    };
  }, [dashboardData]); // Add dashboardData as dependency

  const showCriticalAlertNotification = (alerts) => {
    // You can implement a toast notification here
    console.log('🚨 CRITICAL ALERTS:', alerts);
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('Critical Brand Alert', {
        body: `${alerts.length} critical mentions detected`,
        icon: '/favicon.ico'
      });
    }
  };

  const showDailySummaryNotification = (summary) => {
    // You can implement a toast notification here
    console.log('📋 DAILY SUMMARY:', summary);
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('Daily Brand Intelligence Summary', {
        body: `Sentiment: ${summary.sentimentScore}/100 | Mentions: ${summary.totalMentions}`,
        icon: '/favicon.ico'
      });
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          {!connectionStatus.isConnected && (
            <p className="mt-2 text-sm text-warning-600">
              ⚠️ Real-time updates unavailable
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render Saved Comments Page
  if (currentPage === 'saved') {
    return (
      <SavedCommentsPage onBack={() => setCurrentPage('dashboard')} />
    );
  }

  // Render Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header connectionStatus={connectionStatus} dashboardData={dashboardData} />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <OverviewSection data={dashboardData?.overview} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentSection data={dashboardData?.sentiment} />
          <TrendsSection data={dashboardData?.trends} />
        </div>
        <PlatformLinksSection />
        <ConversationsSection 
          data={dashboardData?.conversations} 
          onShowSavedComments={() => setCurrentPage('saved')}
        />
        <CompetitiveSection data={dashboardData?.competitive} />
      </main>
      
      {/* Real-time status indicator */}
      {!connectionStatus.isConnected && (
        <div className="fixed bottom-4 right-4 bg-warning-100 border border-warning-300 text-warning-800 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Real-time updates disconnected</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
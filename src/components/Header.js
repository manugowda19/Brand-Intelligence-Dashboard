import React, { useState } from 'react';
import { Clock, Download, Settings, Bell, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import PDFGenerator from '../services/pdfGenerator';

const Header = ({ connectionStatus, dashboardData }) => {
  const lastUpdated = new Date();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                LeapScholar Brand Intelligence
              </h1>
              <p className="text-sm text-gray-600">
                Monitor brand sentiment and track conversations across platforms
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Real-time connection status */}
            <div className="flex items-center space-x-2 text-sm">
              {connectionStatus?.isConnected ? (
                <div className="flex items-center space-x-1 text-success-600">
                  <Wifi className="w-4 h-4" />
                  <span>Live</span>
                  {connectionStatus?.usingMockData && (
                    <span className="text-xs text-gray-500">(Demo)</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-warning-600">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  alert('🔔 Notifications: You have 3 critical alerts and 2 new mentions');
                }}
                title="View Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={async () => {
                  if (!dashboardData) {
                    alert('No data available for export');
                    return;
                  }
                  
                  setIsGeneratingPDF(true);
                  try {
                    const pdfGenerator = new PDFGenerator();
                    const pdf = await pdfGenerator.generateReport(dashboardData);
                    pdf.save('leapscholar-brand-intelligence-report.pdf');
                  } catch (error) {
                    console.error('PDF generation error:', error);
                    alert('Failed to generate PDF report');
                  } finally {
                    setIsGeneratingPDF(false);
                  }
                }}
                disabled={isGeneratingPDF}
                title="Export PDF Report"
              >
                <Download className={`w-5 h-5 ${isGeneratingPDF ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  alert('⚙️ Settings: Configure keywords, alerts, and data sources');
                }}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
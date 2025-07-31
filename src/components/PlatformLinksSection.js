import React, { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';
import conversationService from '../services/conversationService';
import PlatformIcons from './PlatformIcons';

const PlatformLinksSection = () => {
  const [linkStats, setLinkStats] = useState({});
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadLinkStats();
  }, []);

  const loadLinkStats = () => {
    const stats = conversationService.loadLinkStats();
    setLinkStats(stats);
  };

  const handleLinkClick = (platform) => {
    conversationService.trackLinkClick(platform);
    loadLinkStats();
    
    // Get the platform link
    const platformLinks = conversationService.getPlatformLinks();
    const link = platformLinks[platform.toLowerCase()];
    
    if (link) {
      window.open(link.url, '_blank');
    }
  };

  const platformLinks = conversationService.getPlatformLinks();

  const getTotalClicks = () => {
    return Object.values(linkStats).reduce((total, platform) => total + (platform.clicks || 0), 0);
  };

  const getMostClickedPlatform = () => {
    let maxClicks = 0;
    let mostClicked = null;
    
    Object.entries(linkStats).forEach(([platform, stats]) => {
      if (stats.clicks > maxClicks) {
        maxClicks = stats.clicks;
        mostClicked = platform;
      }
    });
    
    return mostClicked;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Platform Links</h2>
          <p className="text-sm text-gray-600">Quick access to social media platforms</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Statistics"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Link Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{getTotalClicks()}</p>
              <p className="text-sm text-gray-600">Total Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">
                {getMostClickedPlatform() ? 
                  platformLinks[getMostClickedPlatform()]?.name || getMostClickedPlatform() : 
                  'None'
                }
              </p>
              <p className="text-sm text-gray-600">Most Popular</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning-600">
                {Object.keys(linkStats).length}
              </p>
              <p className="text-sm text-gray-600">Active Platforms</p>
            </div>
          </div>
          
          {/* Detailed Stats */}
          <div className="mt-4 space-y-2">
            {Object.entries(linkStats).map(([platform, stats]) => {
              const platformInfo = platformLinks[platform];
              if (!platformInfo) return null;
              
              return (
                <div key={platform} className="flex items-center justify-between p-2 bg-white rounded">
                                   <div className="flex items-center space-x-3">
                   <div className="flex-shrink-0">
                     {platformInfo.logo ? (
                       <img 
                         src={platformInfo.logo} 
                         alt={`${platformInfo.name} logo`}
                         className="w-6 h-6 rounded object-cover"
                         onError={(e) => {
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'block';
                         }}
                       />
                     ) : null}
                     <div className={`${!platformInfo.logo ? 'block' : 'hidden'}`}>
                       <PlatformIcons platform={platform} className="w-6 h-6" />
                     </div>
                   </div>
                   <div>
                     <p className="font-medium text-gray-900">{platformInfo.name}</p>
                     <p className="text-xs text-gray-500">{platformInfo.description}</p>
                   </div>
                 </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{stats.clicks || 0}</p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Platform Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(platformLinks).map(([key, platform]) => {
          const stats = linkStats[key] || { clicks: 0, lastClicked: null };
          
          return (
            <div
              key={key}
              className="group relative p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer bg-white"
              onClick={() => handleLinkClick(key)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {platform.logo ? (
                    <img 
                      src={platform.logo} 
                      alt={`${platform.name} logo`}
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className={`${!platform.logo ? 'block' : 'hidden'}`}>
                    <PlatformIcons platform={key} className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500">{platform.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
              
              {/* Click Counter */}
              <div className="absolute top-2 right-2">
                <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {stats.clicks || 0}
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                // Open all platforms in new tabs
                Object.values(platformLinks).forEach(platform => {
                  window.open(platform.url, '_blank');
                });
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open All Platforms</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Total Clicks: {getTotalClicks()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformLinksSection; 
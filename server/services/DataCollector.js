const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const Reddit = require('reddit');
const moment = require('moment');

class DataCollector {
  constructor() {
    this.initializeAPIs();
    this.keywords = [
      // Brand terms
      'LeapScholar', 'Leap Scholar', 'LeapFinance',
      // Product/Service terms
      'LeapScholar loan', 'LeapScholar counseling', 'IELTS prep', 'student visa help',
      // Competitor terms
      'MPOWER', 'Prodigy Finance', 'IDP', 'KC Overseas',
      // Strategic industry terms
      'study abroad 2026', 'US visa problems', 'UK student visa', 'best country for MS'
    ];
    
    this.platforms = {
      twitter: {
        enabled: true,
        api: null,
        lastFetch: null
      },
      reddit: {
        enabled: true,
        api: null,
        lastFetch: null
      },
      quora: {
        enabled: true,
        api: null,
        lastFetch: null
      },
      linkedin: {
        enabled: true,
        api: null,
        lastFetch: null
      },
      youtube: {
        enabled: true,
        api: null,
        lastFetch: null
      }
    };
  }

  initializeAPIs() {
    // Twitter API
    if (process.env.TWITTER_BEARER_TOKEN) {
      this.platforms.twitter.api = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    }

    // Reddit API
    if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
      this.platforms.reddit.api = new Reddit({
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
        appId: process.env.REDDIT_CLIENT_ID,
        appSecret: process.env.REDDIT_CLIENT_SECRET,
        userAgent: 'LeapScholar-Brand-Intelligence/1.0.0'
      });
    }

    // LinkedIn API (using web scraping as fallback)
    this.platforms.linkedin.api = {
      search: async (query) => {
        // Implement LinkedIn search via web scraping or API
        return this.scrapeLinkedIn(query);
      }
    };

    // YouTube API
    if (process.env.YOUTUBE_API_KEY) {
      this.platforms.youtube.api = {
        search: async (query) => {
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
              part: 'snippet',
              q: query,
              key: process.env.YOUTUBE_API_KEY,
              maxResults: 50,
              type: 'video',
              order: 'date'
            }
          });
          return response.data;
        }
      };
    }

    // Quora API (using web scraping as fallback)
    this.platforms.quora.api = {
      search: async (query) => {
        return this.scrapeQuora(query);
      }
    };
  }

  async collectAllData() {
    const allData = {
      conversations: [],
      mentions: [],
      trends: [],
      timestamp: new Date().toISOString()
    };

    const promises = [];

    // Collect from each platform
    if (this.platforms.twitter.enabled) {
      promises.push(this.collectTwitterData().then(data => {
        allData.conversations.push(...data.conversations);
        allData.mentions.push(...data.mentions);
      }));
    }

    if (this.platforms.reddit.enabled) {
      promises.push(this.collectRedditData().then(data => {
        allData.conversations.push(...data.conversations);
        allData.mentions.push(...data.mentions);
      }));
    }

    if (this.platforms.quora.enabled) {
      promises.push(this.collectQuoraData().then(data => {
        allData.conversations.push(...data.conversations);
        allData.mentions.push(...data.mentions);
      }));
    }

    if (this.platforms.linkedin.enabled) {
      promises.push(this.collectLinkedInData().then(data => {
        allData.conversations.push(...data.conversations);
        allData.mentions.push(...data.mentions);
      }));
    }

    if (this.platforms.youtube.enabled) {
      promises.push(this.collectYouTubeData().then(data => {
        allData.conversations.push(...data.conversations);
        allData.mentions.push(...data.mentions);
      }));
    }

    // Wait for all data collection to complete
    await Promise.allSettled(promises);

    // Process trends
    allData.trends = this.analyzeTrends(allData.conversations);

    return allData;
  }

  async collectTwitterData() {
    if (!this.platforms.twitter.api) {
      return { conversations: [], mentions: [] };
    }

    try {
      const conversations = [];
      const mentions = [];

      for (const keyword of this.keywords) {
        const tweets = await this.platforms.twitter.api.v2.search(`${keyword} -is:retweet`, {
          'tweet.fields': ['created_at', 'public_metrics', 'author_id', 'text'],
          'user.fields': ['username', 'public_metrics'],
          'expansions': ['author_id'],
          max_results: 100
        });

        for (const tweet of tweets.data || []) {
          const user = tweets.includes?.users?.find(u => u.id === tweet.author_id);
          
          conversations.push({
            id: tweet.id,
            platform: 'Twitter',
            author: user?.username || 'Unknown',
            content: tweet.text,
            timestamp: tweet.created_at,
            engagement: tweet.public_metrics?.like_count + tweet.public_metrics?.retweet_count,
            followers: user?.public_metrics?.followers_count || 0,
            url: `https://twitter.com/${user?.username}/status/${tweet.id}`,
            rawData: tweet
          });

          mentions.push({
            platform: 'Twitter',
            keyword: keyword,
            timestamp: tweet.created_at,
            engagement: tweet.public_metrics?.like_count + tweet.public_metrics?.retweet_count
          });
        }
      }

      this.platforms.twitter.lastFetch = new Date();
      return { conversations, mentions };
    } catch (error) {
      console.error('Twitter data collection error:', error);
      return { conversations: [], mentions: [] };
    }
  }

  async collectRedditData() {
    if (!this.platforms.reddit.api) {
      return { conversations: [], mentions: [] };
    }

    try {
      const conversations = [];
      const mentions = [];
      const subreddits = ['studyabroad', 'gradadmissions', 'Indian_Academia', 'immigration'];

      for (const subreddit of subreddits) {
        for (const keyword of this.keywords) {
          const posts = await this.platforms.reddit.api.get(`/r/${subreddit}/search.json`, {
            q: keyword,
            sort: 'new',
            limit: 25
          });

          for (const post of posts.data?.children || []) {
            const postData = post.data;
            
            conversations.push({
              id: postData.id,
              platform: 'Reddit',
              author: postData.author,
              content: postData.title + ' ' + postData.selftext,
              timestamp: new Date(postData.created_utc * 1000).toISOString(),
              engagement: postData.score + postData.num_comments,
              followers: 0, // Reddit doesn't provide follower count easily
              url: `https://reddit.com${postData.permalink}`,
              subreddit: subreddit,
              rawData: postData
            });

            mentions.push({
              platform: 'Reddit',
              keyword: keyword,
              timestamp: new Date(postData.created_utc * 1000).toISOString(),
              engagement: postData.score + postData.num_comments
            });
          }
        }
      }

      this.platforms.reddit.lastFetch = new Date();
      return { conversations, mentions };
    } catch (error) {
      console.error('Reddit data collection error:', error);
      return { conversations: [], mentions: [] };
    }
  }

  async collectQuoraData() {
    try {
      const conversations = [];
      const mentions = [];

      // Quora web scraping implementation
      for (const keyword of this.keywords) {
        const quoraData = await this.scrapeQuora(keyword);
        
        for (const item of quoraData) {
          conversations.push({
            id: item.id,
            platform: 'Quora',
            author: item.author,
            content: item.content,
            timestamp: item.timestamp,
            engagement: item.engagement,
            followers: item.followers || 0,
            url: item.url,
            rawData: item
          });

          mentions.push({
            platform: 'Quora',
            keyword: keyword,
            timestamp: item.timestamp,
            engagement: item.engagement
          });
        }
      }

      this.platforms.quora.lastFetch = new Date();
      return { conversations, mentions };
    } catch (error) {
      console.error('Quora data collection error:', error);
      return { conversations: [], mentions: [] };
    }
  }

  async collectLinkedInData() {
    try {
      const conversations = [];
      const mentions = [];

      for (const keyword of this.keywords) {
        const linkedinData = await this.scrapeLinkedIn(keyword);
        
        for (const item of linkedinData) {
          conversations.push({
            id: item.id,
            platform: 'LinkedIn',
            author: item.author,
            content: item.content,
            timestamp: item.timestamp,
            engagement: item.engagement,
            followers: item.followers || 0,
            url: item.url,
            rawData: item
          });

          mentions.push({
            platform: 'LinkedIn',
            keyword: keyword,
            timestamp: item.timestamp,
            engagement: item.engagement
          });
        }
      }

      this.platforms.linkedin.lastFetch = new Date();
      return { conversations, mentions };
    } catch (error) {
      console.error('LinkedIn data collection error:', error);
      return { conversations: [], mentions: [] };
    }
  }

  async collectYouTubeData() {
    if (!this.platforms.youtube.api) {
      return { conversations: [], mentions: [] };
    }

    try {
      const conversations = [];
      const mentions = [];

      for (const keyword of this.keywords) {
        const videos = await this.platforms.youtube.api.search(keyword);
        
        for (const video of videos.items || []) {
          // Get comments for each video
          const comments = await this.getYouTubeComments(video.id.videoId);
          
          for (const comment of comments) {
            conversations.push({
              id: comment.id,
              platform: 'YouTube',
              author: comment.authorDisplayName,
              content: comment.textDisplay,
              timestamp: comment.publishedAt,
              engagement: comment.likeCount,
              followers: 0, // YouTube doesn't provide follower count in comments
              url: `https://youtube.com/watch?v=${video.id.videoId}&lc=${comment.id}`,
              videoTitle: video.snippet.title,
              rawData: comment
            });

            mentions.push({
              platform: 'YouTube',
              keyword: keyword,
              timestamp: comment.publishedAt,
              engagement: comment.likeCount
            });
          }
        }
      }

      this.platforms.youtube.lastFetch = new Date();
      return { conversations, mentions };
    } catch (error) {
      console.error('YouTube data collection error:', error);
      return { conversations: [], mentions: [] };
    }
  }

  async getYouTubeComments(videoId) {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
        params: {
          part: 'snippet',
          videoId: videoId,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 100,
          order: 'relevance'
        }
      });
      
      return response.data.items?.map(item => item.snippet.topLevelComment.snippet) || [];
    } catch (error) {
      console.error('YouTube comments error:', error);
      return [];
    }
  }

  async scrapeQuora(query) {
    // Implement Quora web scraping
    // This would use a library like Puppeteer or Cheerio
    return [];
  }

  async scrapeLinkedIn(query) {
    // Implement LinkedIn web scraping
    // This would use a library like Puppeteer or Cheerio
    return [];
  }

  analyzeTrends(conversations) {
    const trends = {};
    const now = moment();
    const last24h = now.clone().subtract(24, 'hours');

    // Group by keyword and analyze trends
    for (const conversation of conversations) {
      for (const keyword of this.keywords) {
        if (conversation.content.toLowerCase().includes(keyword.toLowerCase())) {
          if (!trends[keyword]) {
            trends[keyword] = {
              name: keyword,
              count: 0,
              recentCount: 0,
              trend: 'stable'
            };
          }
          
          trends[keyword].count++;
          
          if (moment(conversation.timestamp).isAfter(last24h)) {
            trends[keyword].recentCount++;
          }
        }
      }
    }

    // Calculate trend direction
    for (const keyword in trends) {
      const trend = trends[keyword];
      if (trend.recentCount > trend.count * 0.1) {
        trend.trend = 'up';
      } else if (trend.recentCount < trend.count * 0.05) {
        trend.trend = 'down';
      } else {
        trend.trend = 'stable';
      }
    }

    return Object.values(trends);
  }

  getStatus() {
    return {
      platforms: Object.keys(this.platforms).map(platform => ({
        name: platform,
        enabled: this.platforms[platform].enabled,
        lastFetch: this.platforms[platform].lastFetch,
        hasAPI: !!this.platforms[platform].api
      })),
      keywords: this.keywords,
      lastCollection: new Date().toISOString()
    };
  }
}

module.exports = DataCollector; 
const axios = require('axios');
const config = require('../config');

module.exports = {
    // YouTube API handler
    youtube: {
        getVideoInfo: async (videoId) => {
            try {
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                    params: {
                        part: 'snippet,contentDetails,statistics',
                        id: videoId,
                        key: process.env.YOUTUBE_API_KEY
                    }
                });
                return response.data;
            } catch (error) {
                console.error('YouTube API Error:', error);
                throw error;
            }
        },
        searchVideos: async (query, maxResults = 5) => {
            try {
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                    params: {
                        part: 'snippet',
                        q: query,
                        maxResults: maxResults,
                        type: 'video',
                        key: process.env.YOUTUBE_API_KEY
                    }
                });
                return response.data;
            } catch (error) {
                console.error('YouTube Search API Error:', error);
                throw error;
            }
        }
    },

    // Instagram API handler
    instagram: {
        getMediaInfo: async (url) => {
            try {
                const response = await axios.get(`https://graph.instagram.com/v12.0/instagram_oembed`, {
                    params: {
                        url: url,
                        access_token: process.env.INSTAGRAM_ACCESS_TOKEN
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Instagram API Error:', error);
                throw error;
            }
        }
    },

    // TikTok API handler
    tiktok: {
        getVideoInfo: async (url) => {
            try {
                const response = await axios.get(`https://api.tiktokv.com/aweme/v1/aweme/detail/`, {
                    params: {
                        url: url,
                        access_token: process.env.TIKTOK_ACCESS_TOKEN
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                return response.data;
            } catch (error) {
                console.error('TikTok API Error:', error);
                throw error;
            }
        }
    },

    // Spotify API handler
    spotify: {
        searchTracks: async (query, limit = 5) => {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/search`, {
                    params: {
                        q: query,
                        type: 'track',
                        limit: limit
                    },
                    headers: {
                        'Authorization': `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Spotify API Error:', error);
                throw error;
            }
        },
        getTrackInfo: async (trackId) => {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Spotify API Error:', error);
                throw error;
            }
        }
    }
};
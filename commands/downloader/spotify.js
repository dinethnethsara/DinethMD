const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '🎵 *Spotify Downloader*\n\n📝 *Usage Guide:*\n• Command: !spotify <url>\n• Supports: Track links only\n\n💡 *Example:*\n!spotify https://open.spotify.com/track/example\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Validate URL format
        const trackUrl = args[0];
        if (!trackUrl.match(/https?:\/\/(open\.)?spotify\.com\/track\/[\w]+/)) {
            await sock.sendMessage(sender, { 
                text: '❌ *Invalid URL Format*\n\n• Please provide a valid Spotify track URL\n• Format: https://open.spotify.com/track/...\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Send processing message with status indicator
        await sock.sendMessage(sender, { 
            text: `🎵 *Spotify Track*\n\n⏳ *Status:* Processing\n🔗 *URL:* ${trackUrl}\n\n⌛ Please wait while I fetch the track info...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Create temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Extract track ID from URL
        const trackId = trackUrl.split('track/')[1]?.split('?')[0];
        if (!trackId) {
            throw new Error('Invalid track ID');
        }

        // Get track info using Spotify API
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${config.apiKeys.spotify}`
            }
        });

        const trackInfo = response.data;
        const trackName = trackInfo.name;
        const artistName = trackInfo.artists[0].name;
        const albumName = trackInfo.album.name;
        const duration = Math.floor(trackInfo.duration_ms / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        // Send success message with enhanced formatting
        await sock.sendMessage(sender, {
            text: `🎵 *Track Information*\n\n📝 *Title:* ${trackName}\n👤 *Artist:* ${artistName}\n💿 *Album:* ${albumName}\n⏱️ *Duration:* ${minutes}:${seconds.toString().padStart(2, '0')}\n\n✨ *Status:* Ready to download\n\n🤖 _Powered by Dineth MD_`
        });

    } catch (error) {
        console.error('Error in spotify command:', error);
        let errorMessage = '❌ *Download Error*\n\n';

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage += '• Invalid or expired API token\n';
            } else if (error.response.status === 404) {
                errorMessage += '• Track not found\n';
            } else if (error.response.status === 429) {
                errorMessage += '• Too many requests. Please try again later\n';
            } else {
                errorMessage += '• Spotify API error occurred\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else if (error.message === 'Invalid track ID') {
            errorMessage += '• Could not extract track ID from URL\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Make sure the track URL is correct and accessible\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};

} catch (error) {
    console.error('Error in spotify command:', error);
    await sock.sendMessage(sender, { 
        text: '❌ *Processing Error*\n\n• Failed to process Spotify track\n• Please try again later\n\n🤖 _Powered by Dineth MD_' 
    });
}
};
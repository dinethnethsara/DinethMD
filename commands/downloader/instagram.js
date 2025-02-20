const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '📸 *Instagram Downloader*\n\n📝 *Usage Guide:*\n• Command: !ig <url>\n• Supports: Posts, Reels, IGTV\n\n💡 *Example:*\n!ig https://www.instagram.com/p/example\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const postUrl = args[0];

        // Validate URL format
        if (!postUrl.match(/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/)) {
            await sock.sendMessage(sender, { 
                text: '❌ *Invalid URL Format*\n\n• Please provide a valid Instagram URL\n• Supported formats: Post, Reel, IGTV\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Send processing message with status indicator
        await sock.sendMessage(sender, { 
            text: `📸 *Instagram Download*\n\n⏳ *Status:* Processing\n🔗 *URL:* ${postUrl}\n\n⌛ Please wait while I fetch the media...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Create temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Make API request to get media info
        const response = await axios.get(`https://api.instagram.com/oembed?url=${postUrl}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const mediaInfo = response.data;
        const title = mediaInfo.title || 'Instagram Media';
        const author = mediaInfo.author_name || 'Unknown';

        // Send success message with enhanced formatting
        await sock.sendMessage(sender, {
            text: `📸 *Instagram Media Details*\n\n📝 *Title:* ${title}\n👤 *Author:* ${author}\n📊 *Type:* ${mediaInfo.type || 'Post'}\n\n✨ *Status:* Ready to download\n\n🤖 _Powered by Dineth MD_`
        });

    } catch (error) {
        console.error('Error in instagram command:', error);
        let errorMessage = '❌ *Download Error*\n\n';

        if (error.response) {
            if (error.response.status === 404) {
                errorMessage += '• Post not found or is private\n';
            } else if (error.response.status === 429) {
                errorMessage += '• Too many requests. Please try again later\n';
            } else {
                errorMessage += '• Instagram API error occurred\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Make sure the post is public\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};

} catch (error) {
    console.error('Error in instagram command:', error);
    await sock.sendMessage(sender, { 
        text: '❌ *Download Error*\n\n• Failed to process Instagram media\n• Please try again later\n\n🤖 _Powered by Dineth MD_' 
    });
}
};
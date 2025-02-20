const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    if (!args[0]) {
        await sock.sendMessage(sender, { text: '❌ Please provide a TikTok video URL!\n\n🤖 Powered by Dineth MD' });
        return;
    }

    try {
        // Send processing message
        await sock.sendMessage(sender, { 
            text: `📥 Processing TikTok video...\nPlease wait...\n\n🤖 Powered by Dineth MD` 
        });

        // Create temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const videoUrl = args[0];
        
        // Make API request to get video info
        const response = await axios.get(`https://api.tiktokv.com/aweme/v1/aweme/detail/?aweme_id=${extractVideoId(videoUrl)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const videoData = response.data.aweme_detail;
        const videoTitle = videoData.desc || 'TikTok Video';
        const downloadUrl = videoData.video.play_addr.url_list[0];

        // Download video
        const videoResponse = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        const videoPath = path.join(tempDir, `${Date.now()}.mp4`);
        fs.writeFileSync(videoPath, videoResponse.data);

        // Send video
        await sock.sendMessage(sender, {
            video: fs.readFileSync(videoPath),
            caption: `🎥 *${videoTitle}*\n\n📤 Downloaded using Dineth MD`
        });

        // Clean up
        fs.unlinkSync(videoPath);

    } catch (error) {
        console.error('Error in tiktok command:', error);
        await sock.sendMessage(sender, { 
            text: '❌ An error occurred while processing the TikTok video.\n\n🤖 Powered by Dineth MD' 
        });
    }
};

function extractVideoId(url) {
    const regex = /\/@[\w.-]+\/video\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}
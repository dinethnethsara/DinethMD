const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    name: 'instagram',
    category: 'downloader',
    description: 'Download Instagram photos and videos',
    async execute(msg, args, client) {
        const sender = msg.key.remoteJid;

        try {
            if (!args.length) {
                await client.sendMessage(sender, { 
                    text: '❌ Please provide an Instagram post URL!\n\nExample: !instagram https://www.instagram.com/p/xxxxx' 
                });
                return;
            }

            const url = args[0];
            if (!url.match(/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/([^/?#&]+)/)) {
                await client.sendMessage(sender, { 
                    text: '❌ Invalid Instagram URL! Please provide a valid Instagram post link.' 
                });
                return;
            }

            // Send processing message
            await client.sendMessage(sender, { 
                text: '⏳ Processing your request... Please wait.' 
            });

            // Create temporary directory if it doesn't exist
            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Make API request to get media info
            const response = await axios({
                method: 'GET',
                url: `https://api.example.com/instagram?url=${encodeURIComponent(url)}`,
                headers: {
                    'Authorization': `Bearer ${config.apiKeys.instagram}`
                }
            });

            const mediaUrl = response.data.url;
            const mediaType = response.data.type;
            const caption = response.data.caption || '';

            // Download and send media
            const mediaResponse = await axios({
                method: 'GET',
                url: mediaUrl,
                responseType: 'arraybuffer'
            });

            const mediaPath = path.join(tempDir, `${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`);
            fs.writeFileSync(mediaPath, mediaResponse.data);

            // Send media with appropriate method
            await client.sendMessage(sender, {
                [mediaType === 'video' ? 'video' : 'image']: fs.readFileSync(mediaPath),
                caption: `📸 *Instagram ${mediaType}*\n\n${caption}\n\n_Powered by Dineth MD_`,
                contextInfo: {
                    externalAdReply: {
                        title: "✨ Dineth MD - Instagram Downloader",
                        body: "Download Instagram Photos & Videos",
                        thumbnailUrl: "https://i.ibb.co/XjgQX5n/bot.jpg",
                        sourceUrl: url,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });

            // Clean up
            fs.unlinkSync(mediaPath);

        } catch (error) {
            console.error('Error in Instagram download:', error);
            await client.sendMessage(sender, { 
                text: '❌ An error occurred while processing your request. Please try again later.' 
            });
        }
    }
};
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const config = require('../../config');

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    
    try {
        const messageType = Object.keys(msg.message)[0];
        const content = msg.message[messageType];
        
        // Check if message has media
        if (!['imageMessage', 'videoMessage'].includes(messageType)) {
            await sock.sendMessage(sender, { text: '🖼️ *Sticker Creator*\n\n• Please send an image or video\n• Use !sticker command as caption\n• Max video length: 10 seconds\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { text: '⏳ *Creating Sticker*\n\n• Processing your media\n• Please wait a moment...\n\n🤖 _Powered by Dineth MD_' });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download media
        const mediaData = await sock.downloadMediaMessage(msg);
        const mediaPath = path.join(tempDir, `${Date.now()}.${messageType === 'imageMessage' ? 'jpg' : 'mp4'}`);
        fs.writeFileSync(mediaPath, mediaData);

        // Convert to WebP
        const outputPath = path.join(tempDir, `${Date.now()}.webp`);
        
        if (messageType === 'imageMessage') {
            // Process image
            await new Promise((resolve, reject) => {
                ffmpeg(mediaPath)
                    .toFormat('webp')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });
        } else {
            // Process video (first 10 seconds)
            await new Promise((resolve, reject) => {
                ffmpeg(mediaPath)
                    .setDuration(10)
                    .toFormat('webp')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });
        }

        // Send sticker
        await sock.sendMessage(sender, { 
            sticker: fs.readFileSync(outputPath),
            mimetype: 'image/webp'
        });

        // Clean up temp files
        fs.unlinkSync(mediaPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error('Error in sticker command:', error);
        await sock.sendMessage(sender, { text: '❌ *Sticker Creation Failed*\n\n• An error occurred\n• Please try again later\n\n🤖 _Powered by Dineth MD_' });
    }
};
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const config = require('../../config');

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    
    try {
        const messageType = Object.keys(msg.message)[0];
        
        // Check if message has a sticker
        if (messageType !== 'stickerMessage') {
            await sock.sendMessage(sender, { text: '🖼️ *Sticker to Image Converter*\n\n• Please send a sticker\n• Use !toimg command as caption\n• Supports all sticker types\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { text: '⏳ *Converting Sticker*\n\n• Processing your sticker\n• Please wait a moment...\n\n🤖 _Powered by Dineth MD_' });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download sticker
        const stickerData = await sock.downloadMediaMessage(msg);
        const stickerPath = path.join(tempDir, `${Date.now()}.webp`);
        fs.writeFileSync(stickerPath, stickerData);

        // Convert to PNG
        const outputPath = path.join(tempDir, `${Date.now()}.png`);
        
        await new Promise((resolve, reject) => {
            ffmpeg(stickerPath)
                .toFormat('png')
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });

        // Send image
        await sock.sendMessage(sender, { 
            image: fs.readFileSync(outputPath),
            caption: `🖼️ *Conversion Complete*\n\n• Sticker converted to image\n• Format: PNG\n\n🤖 _Powered by Dineth MD_`
        });

        // Clean up temp files
        fs.unlinkSync(stickerPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error('Error in toimg command:', error);
        await sock.sendMessage(sender, { text: '❌ *Conversion Error*\n\n• Failed to convert sticker\n• Please try again later\n\n🤖 _Powered by Dineth MD_' });
    }
};
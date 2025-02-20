const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const config = require('../../config');

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    
    try {
        const messageType = Object.keys(msg.message)[0];
        
        // Check if message has a video or audio
        if (!['videoMessage', 'audioMessage'].includes(messageType)) {
            await sock.sendMessage(sender, { text: '🎵 *MP3 Converter*\n\n• Please send a video or audio\n• Use !tomp3 command as caption\n• Supports all video/audio formats\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { text: '⏳ *Converting to MP3*\n\n• Processing your media\n• Please wait a moment...\n\n🤖 _Powered by Dineth MD_' });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download media
        const mediaData = await sock.downloadMediaMessage(msg);
        const mediaPath = path.join(tempDir, `${Date.now()}.${messageType === 'videoMessage' ? 'mp4' : 'mp3'}`);
        fs.writeFileSync(mediaPath, mediaData);

        // Convert to MP3
        const outputPath = path.join(tempDir, `${Date.now()}.mp3`);
        
        await new Promise((resolve, reject) => {
            ffmpeg(mediaPath)
                .toFormat('mp3')
                .audioBitrate(128)
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });

        // Send audio
        await sock.sendMessage(sender, { 
            audio: fs.readFileSync(outputPath),
            mimetype: 'audio/mp3',
            caption: `🎵 *Conversion Complete*\n\n• Media converted to MP3\n• Quality: 128kbps\n\n🤖 _Powered by Dineth MD_`
        });

        // Clean up temp files
        fs.unlinkSync(mediaPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error('Error in tomp3 command:', error);
        await sock.sendMessage(sender, { text: '❌ *Conversion Error*\n\n• Failed to convert to MP3\n• Please try again later\n\n🤖 _Powered by Dineth MD_' });
    }
};
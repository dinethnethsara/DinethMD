const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    
    try {
        const messageType = Object.keys(msg.message)[0];
        
        // Check if message has an audio file
        if (!['audioMessage'].includes(messageType)) {
            await sock.sendMessage(sender, { text: '🎵 *Audio Format Converter*\n\n• Please send an audio file\n• Use !audio <format> command\n• Supported: mp3, wav, ogg, m4a\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        // Check if format is specified
        if (!args[0]) {
            await sock.sendMessage(sender, { text: '🎵 *Audio Format Converter*\n\n• Format not specified\n• Example: !audio mp3\n• Supported: mp3, wav, ogg, m4a\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        const format = args[0].toLowerCase();
        const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a'];

        if (!supportedFormats.includes(format)) {
            await sock.sendMessage(sender, { text: `🎵 *Audio Format Converter*\n\n• Unsupported format\n• Supported: ${supportedFormats.join(', ')}\n\n🤖 _Powered by Dineth MD_` });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { text: `🎵 *Audio Format Converter*\n\n• Converting to ${format.toUpperCase()}\n• Please wait a moment...\n\n🤖 _Powered by Dineth MD_` });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download audio
        const audioData = await sock.downloadMediaMessage(msg);
        const inputPath = path.join(tempDir, `${Date.now()}_input.${messageType === 'audioMessage' ? 'mp3' : 'ogg'}`);
        fs.writeFileSync(inputPath, audioData);

        // Convert audio
        const outputPath = path.join(tempDir, `${Date.now()}_output.${format}`);
        
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat(format)
                .audioBitrate(128)
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });

        // Send converted audio
        await sock.sendMessage(sender, { 
            audio: fs.readFileSync(outputPath),
            mimetype: `audio/${format}`,
            caption: `🎵 *Audio Conversion Complete*\n\n• Format: ${format.toUpperCase()}\n• Quality: 128kbps\n\n🤖 _Powered by Dineth MD_`
        });

        // Clean up temp files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error('Error in audio command:', error);
        await sock.sendMessage(sender, { text: '❌ *Conversion Error*\n\n• Failed to convert audio\n• Please try again later\n\n🤖 _Powered by Dineth MD_' });
    }
};
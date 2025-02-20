const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '🎥 *YouTube Video Downloader*\n\n📝 *Usage Guide:*\n• Command: !ytv <url>\n• Supports: All video qualities\n\n💡 *Example:*\n!ytv https://youtube.com/watch?v=example\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const videoUrl = args[0];

        // Validate URL format
        if (!videoUrl.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)) {
            await sock.sendMessage(sender, { 
                text: '❌ *Invalid URL Format*\n\n• Please provide a valid YouTube URL\n• Supported formats: youtube.com, youtu.be\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `🎥 *YouTube Download*\n\n⏳ *Status:* Processing\n🔗 *URL:* ${videoUrl}\n\n⌛ Please wait while I fetch the video...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Get video info
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title;
        const duration = parseInt(videoInfo.videoDetails.lengthSeconds);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        // Create temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Set up download options
        const options = {
            quality: config.download.quality === 'highest' ? 'highest' : 'lowest',
            filter: 'videoandaudio'
        };

        // Download and save video
        const videoPath = path.join(tempDir, `${Date.now()}.mp4`);
        const videoStream = ytdl(videoUrl, options);
        const fileStream = fs.createWriteStream(videoPath);

        videoStream.pipe(fileStream);

        // Send progress message
        await sock.sendMessage(sender, {
            text: `🎥 *Video Information*\n\n📝 *Title:* ${videoTitle}\n⏱️ *Duration:* ${minutes}:${seconds.toString().padStart(2, '0')}\n📊 *Quality:* ${config.download.quality}\n\n⏳ *Status:* Downloading...\n\n🤖 _Powered by Dineth MD_`
        });

        fileStream.on('finish', async () => {
            try {
                // Send video file
                await sock.sendMessage(sender, {
                    video: fs.readFileSync(videoPath),
                    caption: `🎥 *Download Complete*\n\n📝 *Title:* ${videoTitle}\n⏱️ *Duration:* ${minutes}:${seconds.toString().padStart(2, '0')}\n📊 *Quality:* ${config.download.quality}\n\n✨ *Status:* Complete\n\n🤖 _Powered by Dineth MD_`
                });

                // Clean up temporary file
                fs.unlinkSync(videoPath);
            } catch (error) {
                console.error('Error sending video:', error);
                await sock.sendMessage(sender, { 
                    text: '❌ *Send Error*\n\n• Failed to send video\n• File might be too large\n\n🤖 _Powered by Dineth MD_' 
                });
            }
        });

        fileStream.on('error', async (error) => {
            console.error('Error downloading video:', error);
            await sock.sendMessage(sender, { 
                text: '❌ *Download Error*\n\n• Failed to download video\n• Please try again later\n\n🤖 _Powered by Dineth MD_' 
            });
        });

        videoStream.on('error', async (error) => {
            console.error('Error streaming video:', error);
            await sock.sendMessage(sender, { 
                text: '❌ *Stream Error*\n\n• Failed to stream video\n• Video might be unavailable\n\n🤖 _Powered by Dineth MD_' 
            });
        });

    } catch (error) {
        console.error('Error in ytv command:', error);
        let errorMessage = '❌ *Processing Error*\n\n';

        if (error.message.includes('Video unavailable')) {
            errorMessage += '• Video is unavailable or private\n';
        } else if (error.message.includes('age-restricted')) {
            errorMessage += '• Video is age-restricted\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Make sure the video is public and accessible\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};

} catch (error) {
    console.error('Error in ytv command:', error);
    await sock.sendMessage(sender, { text: '❌ *Processing Error*\n\n• An error occurred\n• Please try again later\n\n🤖 _Powered by Dineth MD_' });
}
};
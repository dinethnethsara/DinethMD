const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    name: 'ytv',
    category: 'downloader',
    description: 'Download YouTube videos in high quality',
    async execute(msg, args, client) {
        const sender = msg.key.remoteJid;

        try {
            if (!args.length) {
                await client.sendMessage(sender, { 
                    text: '❌ Please provide a YouTube video URL!\n\nExample: !ytv https://youtu.be/xxxxx' 
                });
                return;
            }

            const url = args[0];
            if (!ytdl.validateURL(url)) {
                await client.sendMessage(sender, { 
                    text: '❌ Invalid YouTube URL! Please provide a valid YouTube video link.' 
                });
                return;
            }

            // Send processing message
            await client.sendMessage(sender, { 
                text: '⏳ Processing your request... Please wait.' 
            });

            // Get video info
            const info = await ytdl.getInfo(url);
            const videoTitle = info.videoDetails.title;
            const thumbnail = info.videoDetails.thumbnails[0].url;

            // Create temporary directory if it doesn't exist
            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Set up download path
            const videoPath = path.join(tempDir, `${Date.now()}.mp4`);

            // Download video
            const video = ytdl(url, { 
                quality: 'highest',
                filter: 'audioandvideo'
            });

            const writeStream = fs.createWriteStream(videoPath);
            video.pipe(writeStream);

            writeStream.on('finish', async () => {
                // Send the video
                await client.sendMessage(sender, {
                    video: fs.readFileSync(videoPath),
                    caption: `🎥 *${videoTitle}*\n\n_Powered by Dineth MD_`,
                    contextInfo: {
                        externalAdReply: {
                            title: "✨ Dineth MD - YouTube Downloader",
                            body: videoTitle,
                            thumbnailUrl: thumbnail,
                            sourceUrl: url,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                });

                // Clean up
                fs.unlinkSync(videoPath);
            });

            writeStream.on('error', async (error) => {
                console.error('Error downloading video:', error);
                await client.sendMessage(sender, { 
                    text: '❌ An error occurred while downloading the video. Please try again later.' 
                });
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            });

        } catch (error) {
            console.error('Error in YouTube download:', error);
            await client.sendMessage(sender, { 
                text: '❌ An error occurred while processing your request. Please try again later.' 
            });
        }
    }
};
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

module.exports = {
    // Create temporary directory for media files
    createTempDir: () => {
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        return tempDir;
    },

    // Clean up temporary files
    cleanupTempFiles: (filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Error cleaning up temp file:', error);
        }
    },

    // Download media from URL
    downloadMedia: async (url, filename) => {
        try {
            const tempDir = module.exports.createTempDir();
            const filePath = path.join(tempDir, filename);
            
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(filePath));
                writer.on('error', reject);
            });
        } catch (error) {
            console.error('Error downloading media:', error);
            throw error;
        }
    },

    // Convert video to audio
    videoToAudio: (videoPath, outputPath) => {
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .toFormat('mp3')
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    },

    // Compress video
    compressVideo: (videoPath, outputPath, quality = 'medium') => {
        const qualities = {
            low: { videoBitrate: '500k', audioBitrate: '64k' },
            medium: { videoBitrate: '1000k', audioBitrate: '128k' },
            high: { videoBitrate: '2000k', audioBitrate: '192k' }
        };

        const settings = qualities[quality] || qualities.medium;

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .videoBitrate(settings.videoBitrate)
                .audioBitrate(settings.audioBitrate)
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    },

    // Extract audio from video
    extractAudio: (videoPath, outputPath) => {
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo()
                .audioCodec('libmp3lame')
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    }
};
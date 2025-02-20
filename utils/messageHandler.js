const fs = require('fs');
const path = require('path');

class MessageHandler {
    constructor() {
        this.messageCache = new Map();
        this.viewOnceCache = new Map();
        this.cacheDir = path.join(__dirname, '../temp/cache');
        this.ensureCacheDir();
    }

    ensureCacheDir() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }

    cacheMessage(messageId, message) {
        this.messageCache.set(messageId, {
            message,
            timestamp: Date.now()
        });

        // Clean old messages after 1 hour
        setTimeout(() => {
            this.messageCache.delete(messageId);
        }, 3600000);
    }

    getCachedMessage(messageId) {
        return this.messageCache.get(messageId);
    }

    async handleViewOnceMedia(message) {
        try {
            if (!message.message?.viewOnceMessage) return null;

            const mediaType = Object.keys(message.message.viewOnceMessage.message)[0];
            const mediaData = message.message.viewOnceMessage.message[mediaType];
            const fileName = `viewonce_${message.key.id}_${Date.now()}`;
            const filePath = path.join(this.cacheDir, fileName);

            // Save media data
            this.viewOnceCache.set(message.key.id, {
                mediaType,
                mediaData,
                filePath,
                timestamp: Date.now()
            });

            return {
                mediaType,
                mediaData
            };
        } catch (error) {
            console.error('Error handling view once media:', error);
            return null;
        }
    }

    getViewOnceMedia(messageId) {
        return this.viewOnceCache.get(messageId);
    }

    cleanOldCache() {
        const oneHourAgo = Date.now() - 3600000;

        // Clean message cache
        for (const [id, data] of this.messageCache.entries()) {
            if (data.timestamp < oneHourAgo) {
                this.messageCache.delete(id);
            }
        }

        // Clean view once cache
        for (const [id, data] of this.viewOnceCache.entries()) {
            if (data.timestamp < oneHourAgo) {
                if (fs.existsSync(data.filePath)) {
                    fs.unlinkSync(data.filePath);
                }
                this.viewOnceCache.delete(id);
            }
        }
    }
}

module.exports = new MessageHandler();
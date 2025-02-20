const config = require('../config');

module.exports = {
    // Message rate limiting
    rateLimiter: {
        userLimits: new Map(),
        groupLimits: new Map(),
        
        checkLimit: (userId, groupId = null, maxMessages = 10, timeWindow = 60000) => {
            const key = groupId ? `${userId}:${groupId}` : userId;
            const limits = groupId ? module.exports.rateLimiter.groupLimits : module.exports.rateLimiter.userLimits;
            
            if (!limits.has(key)) {
                limits.set(key, {
                    count: 1,
                    firstMessage: Date.now()
                });
                return true;
            }
            
            const userLimit = limits.get(key);
            const currentTime = Date.now();
            
            if (currentTime - userLimit.firstMessage > timeWindow) {
                userLimit.count = 1;
                userLimit.firstMessage = currentTime;
                return true;
            }
            
            if (userLimit.count >= maxMessages) {
                return false;
            }
            
            userLimit.count++;
            return true;
        },
        
        resetLimits: () => {
            module.exports.rateLimiter.userLimits.clear();
            module.exports.rateLimiter.groupLimits.clear();
        }
    },

    // Spam detection
    spamDetection: {
        patterns: [
            /(?:\W|^)(\w+)(?:\W|$)(?:\W|^)\1(?:\W|$)/i, // Repeated words
            /([A-Za-z0-9])\1{4,}/,  // Character spam
            /(.[\s\S]{0,10})\1{3,}/  // Pattern spam
        ],

        isSpam: (message) => {
            return module.exports.spamDetection.patterns.some(pattern => pattern.test(message));
        }
    },

    // Message safety checks
    messageSafety: {
        checkText: (text) => {
            // Remove potentially harmful characters
            text = text.replace(/[\u200b-\u200f\u202a-\u202e]/g, '');
            // Limit message length
            return text.substring(0, 4096);
        },

        sanitizeMessage: (message) => {
            if (typeof message === 'string') {
                return module.exports.messageSafety.checkText(message);
            }
            if (message.text) {
                message.text = module.exports.messageSafety.checkText(message.text);
            }
            if (message.caption) {
                message.caption = module.exports.messageSafety.checkText(message.caption);
            }
            return message;
        }
    },

    // Command cooldown system
    cooldown: {
        cooldowns: new Map(),

        check: (userId, command, cooldownTime = 3000) => {
            const key = `${userId}:${command}`;
            const currentTime = Date.now();
            const userCooldown = module.exports.cooldown.cooldowns.get(key);

            if (!userCooldown || currentTime - userCooldown > cooldownTime) {
                module.exports.cooldown.cooldowns.set(key, currentTime);
                return true;
            }
            return false;
        },

        getCooldownTime: (userId, command) => {
            const key = `${userId}:${command}`;
            const userCooldown = module.exports.cooldown.cooldowns.get(key);
            return userCooldown ? Math.max(0, 3000 - (Date.now() - userCooldown)) : 0;
        }
    },

    // Message encryption for private chats
    encryption: {
        encrypt: (text, key = config.encryptionKey) => {
            try {
                return text
                    .split('')
                    .map(char => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0)))
                    .join('');
            } catch (error) {
                console.error('Encryption error:', error);
                return text;
            }
        },

        decrypt: (text, key = config.encryptionKey) => {
            try {
                return text
                    .split('')
                    .map(char => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0)))
                    .join('');
            } catch (error) {
                console.error('Decryption error:', error);
                return text;
            }
        }
    },

    // Auto message deletion for sensitive commands
    autoDelete: {
        messages: new Set(),

        add: (messageId, deleteAfter = 60000) => {
            module.exports.autoDelete.messages.add(messageId);
            setTimeout(() => {
                module.exports.autoDelete.messages.delete(messageId);
            }, deleteAfter);
        },

        shouldDelete: (messageId) => {
            return module.exports.autoDelete.messages.has(messageId);
        }
    }
};
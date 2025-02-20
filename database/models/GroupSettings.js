const mongoose = require('mongoose');

const groupSettingsSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true,
        unique: true
    },
    welcomeMessage: {
        enabled: {
            type: Boolean,
            default: true
        },
        customMessage: {
            type: String,
            default: null
        }
    },
    goodbyeMessage: {
        enabled: {
            type: Boolean,
            default: true
        },
        customMessage: {
            type: String,
            default: null
        }
    },
    autoReactions: {
        enabled: {
            type: Boolean,
            default: true
        },
        customEmojis: {
            image: [String],
            video: [String],
            sticker: [String],
            audio: [String],
            document: [String],
            status: [String]
        }
    },
    antiSpam: {
        enabled: {
            type: Boolean,
            default: false
        },
        maxMessages: {
            type: Number,
            default: 5
        },
        timeWindow: {
            type: Number,
            default: 10
        }
    },
    bannedUsers: [{
        userId: String,
        reason: String,
        bannedAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GroupSettings', groupSettingsSchema);
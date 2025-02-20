const config = require('../../config');

module.exports = {
    // Handle group participant changes (join/leave)
    async handleParticipantUpdate(sock, update) {
        const { id, participants, action } = update;
        
        try {
            // Get group metadata
            const groupMetadata = await sock.groupMetadata(id);
            const groupName = groupMetadata.subject;

            if (action === 'add') {
                // Welcome message
                const welcomeMsg = `👋 Welcome to *${groupName}*!\n\n` +
                    `@${participants[0].split('@')[0]}\n\n` +
                    `🌟 We're glad to have you here!\n` +
                    `📝 Please read the group rules and enjoy your stay.\n\n` +
                    `🤖 _Powered by Dineth MD_`;

                await sock.sendMessage(id, {
                    text: welcomeMsg,
                    mentions: participants
                });
            } else if (action === 'remove') {
                // Goodbye message
                const goodbyeMsg = `👋 Goodbye @${participants[0].split('@')[0]}!\n\n` +
                    `We'll miss you in *${groupName}*. Take care!\n\n` +
                    `🤖 _Powered by Dineth MD_`;

                await sock.sendMessage(id, {
                    text: goodbyeMsg,
                    mentions: participants
                });
            }
        } catch (error) {
            console.error('Error in participant update handler:', error);
        }
    },

    // Handle auto-reactions for messages
    async handleMessageReaction(sock, msg) {
        try {
            // Check if message is from a group
            const isGroup = msg.key.remoteJid.endsWith('@g.us');
            if (!isGroup) return;

            // Random reactions for different message types
            const reactions = {
                image: ['❤️', '😍', '🔥', '👍', '✨'],
                video: ['🎥', '👀', '🔥', '👌', '🎬'],
                sticker: ['😆', '😎', '🤩', '👍', '🌟'],
                audio: ['🎵', '🎶', '🎧', '🎼', '🎹'],
                document: ['📄', '📑', '📎', '✅', '👍'],
                status: ['❤️', '😍', '🔥', '✨', '👏']
            };

            // Get message type
            const messageType = Object.keys(msg.message)[0];
            let reactionEmojis = reactions[messageType] || ['👍', '❤️', '✨', '🔥', '👌'];

            // Randomly select an emoji
            const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

            // Send reaction
            await sock.sendMessage(msg.key.remoteJid, {
                react: {
                    text: randomEmoji,
                    key: msg.key
                }
            });
        } catch (error) {
            console.error('Error in message reaction handler:', error);
        }
    }
};
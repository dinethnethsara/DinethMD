const { MessageType } = require('@whiskeysockets/baileys');
const moment = require('moment-timezone');

class GroupEvents {
    constructor() {
        this.welcomeEnabled = true;
        this.goodbyeEnabled = true;
        this.reactionEnabled = true;
        this.antiSpamEnabled = true;
        this.reactionRateLimit = new Map();
        this.messageRateLimit = new Map();
        this.rateLimitDuration = 2000; // 2 seconds
        this.spamThreshold = 5; // messages per rateLimitDuration
        this.welcomeStyles = [
            'default',
            'minimal',
            'colorful',
            'box',
            'ascii'
        ];
        this.currentStyle = 'default';
    }

    getMessageStyle(type, data) {
        const { participant, metadata, time } = data;
        const styles = {
            default: {
                welcome: `╭─⊣〘 🎉 WELCOME 🎉 〙
├ Name: @${participant.split('@')[0]}
├ Group: ${metadata.subject}
├ Time: ${time}
├ Members: ${metadata.participants.length}
╰────────────────
Powered by Dineth MD`,
                goodbye: `╭─⊣〘 👋 GOODBYE 👋 〙
├ Name: @${participant.split('@')[0]}
├ Group: ${metadata.subject}
├ Time: ${time}
├ Members: ${metadata.participants.length}
╰────────────────
Powered by Dineth MD`
            },
            minimal: {
                welcome: `• Welcome @${participant.split('@')[0]} to ${metadata.subject} 🎉`,
                goodbye: `• Goodbye @${participant.split('@')[0]} 👋`
            },
            colorful: {
                welcome: `🌈 *W E L C O M E*

👤 @${participant.split('@')[0]}
🌟 Has joined ${metadata.subject}
⏰ Time: ${time}
👥 Total: ${metadata.participants.length} members

🎊 Powered by Dineth MD`,
                goodbye: `🌈 *G O O D B Y E*

👤 @${participant.split('@')[0]}
💫 Has left ${metadata.subject}
⏰ Time: ${time}
👥 Total: ${metadata.participants.length} members

🎈 Powered by Dineth MD`
            },
            box: {
                welcome: `┏━━━━『 Welcome 』━━━━┓
┃ 👋 @${participant.split('@')[0]}
┃ 📢 Group: ${metadata.subject}
┃ ⏰ Time: ${time}
┃ 👥 Members: ${metadata.participants.length}
┗━━━━━━━━━━━━━━━┛`,
                goodbye: `┏━━━━『 Goodbye 』━━━━┓
┃ 👋 @${participant.split('@')[0]}
┃ 📢 Group: ${metadata.subject}
┃ ⏰ Time: ${time}
┃ 👥 Members: ${metadata.participants.length}
┗━━━━━━━━━━━━━━━┛`
            },
            ascii: {
                welcome: `
    ╔═══════════════╗
    ║  🎉 WELCOME 🎉  ║
    ╚═══════════════╝

    @${participant.split('@')[0]}
    ${metadata.subject}
    Members: ${metadata.participants.length}
    
    ╔═══════════════╗
    ║  Dineth MD Bot ║
    ╚═══════════════╝`,
                goodbye: `
    ╔═══════════════╗
    ║  👋 GOODBYE 👋  ║
    ╚═══════════════╝

    @${participant.split('@')[0]}
    ${metadata.subject}
    Members: ${metadata.participants.length}
    
    ╔═══════════════╗
    ║  Dineth MD Bot ║
    ╚═══════════════╝`
            }
        };
        return styles[this.currentStyle]?.[type] || styles.default[type];
    }

    async handleParticipantUpdate(sock, update) {
        try {
            const metadata = await sock.groupMetadata(update.id);
            const participants = update.participants;
            const time = moment().tz('Asia/Colombo').format('HH:mm:ss');

            for (const participant of participants) {
                const messageData = { participant, metadata, time };
                
                if (update.action === 'add' && this.welcomeEnabled) {
                    const welcomeMessage = this.getMessageStyle('welcome', messageData);
                    await sock.sendMessage(update.id, {
                        text: welcomeMessage,
                        mentions: [participant]
                    });
                } else if (update.action === 'remove' && this.goodbyeEnabled) {
                    const goodbyeMessage = this.getMessageStyle('goodbye', messageData);
                    await sock.sendMessage(update.id, {
                        text: goodbyeMessage,
                        mentions: [participant]
                    });
                }
            }
        } catch (error) {
            console.error('Error in handleParticipantUpdate:', error);
        }
    }

    setWelcomeEnabled(enabled) {
        this.welcomeEnabled = enabled;
    }

    setGoodbyeEnabled(enabled) {
        this.goodbyeEnabled = enabled;
    }

    setReactionEnabled(enabled) {
        this.reactionEnabled = enabled;
    }

    setAntiSpamEnabled(enabled) {
        this.antiSpamEnabled = enabled;
    }

    async handleSpam(sock, msg) {
        if (!this.antiSpamEnabled) return false;

        const sender = msg.key.participant || msg.key.remoteJid;
        const now = Date.now();

        if (!this.messageRateLimit.has(sender)) {
            this.messageRateLimit.set(sender, [now]);
            return false;
        }

        const timestamps = this.messageRateLimit.get(sender);
        const recentTimestamps = timestamps.filter(t => now - t < this.rateLimitDuration);

        if (recentTimestamps.length >= this.spamThreshold) {
            return true;
        }

        recentTimestamps.push(now);
        this.messageRateLimit.set(sender, recentTimestamps);
        return false;
    }

    async handleMessageReaction(sock, reaction) {
        try {
            if (!this.reactionEnabled) return;

            const senderId = reaction.key.participant || reaction.key.remoteJid;
            const now = Date.now();
            const lastReaction = this.reactionRateLimit.get(senderId) || 0;

            if (now - lastReaction < this.rateLimitDuration) {
                return; // Rate limit exceeded
            }

            this.reactionRateLimit.set(senderId, now);

            const messageInfo = {
                react: {
                    text: reaction.reaction,
                    key: reaction.key
                }
            };

            await sock.sendMessage(reaction.key.remoteJid, messageInfo);
        } catch (error) {
            console.error('Error in handleMessageReaction:', error);
        }
    }
}

module.exports = new GroupEvents();
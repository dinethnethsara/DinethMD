const moment = require('moment-timezone');

module.exports = {
    name: 'feedback',
    alias: ['suggest'],
    category: 'general',
    desc: 'Send feedback to owner',
    async execute(sock, msg, args) {
        const { pushName } = msg;
        const time = moment().format('HH:mm:ss');

        if (!args[0]) {
            return await sock.sendMessage(msg.chat, { 
                text: '❌ Please provide your feedback message!\n\nExample: .feedback Great bot, love the features!' 
            });
        }

        const feedback = args.join(' ');

        const feedbackText = `*📝 NEW FEEDBACK*\n\n`
            + `👤 From: ${pushName}\n`
            + `🆔 User ID: ${msg.sender}\n`
            + `⏰ Time: ${time}\n`
            + `📱 Device: ${msg.device || 'Unknown'}\n`
            + `💬 Chat Type: ${msg.isGroup ? 'Group' : 'Private'}\n\n`
            + `📨 Message:\n${feedback}\n\n`
            + `📊 Message Length: ${feedback.length} characters\n`
            + `🔰 Powered by Dineth MD`;

        // Send feedback to owner
        for (const owner of global.owner) {
            await sock.sendMessage(owner, { text: feedbackText });
        }

        // Send confirmation to user
        await sock.sendMessage(msg.chat, { 
            text: '✅ Thank you for your feedback! It has been sent to the bot owner.' 
        });
    }
}
const moment = require('moment-timezone');

module.exports = {
    name: 'donate',
    alias: ['support'],
    category: 'general',
    desc: 'Support the bot development',
    async execute(sock, msg, args) {
        const { pushName } = msg;
        const time = moment().format('HH:mm:ss');

        let donateText = `*🎁 SUPPORT DINETH MD BOT*\n\n`;
        donateText += `👋 Hi ${pushName}!\n`;
        donateText += `⏰ Time: ${time}\n\n`;
        donateText += `Thank you for your interest in supporting our bot development!\n\n`;
        donateText += `*💳 Payment Methods*\n`;
        donateText += `• Buy Me a Coffee: buymeacoffee.com/dinethnethsara\n`;
        donateText += `• Patreon: patreon.com/dinethnethsara\n\n`;
        donateText += `Your support helps us maintain and improve the bot.\n`;
        donateText += `Every contribution is greatly appreciated! 🙏\n\n`;
        donateText += `🔰 Powered by Dineth MD`;

        await sock.sendMessage(msg.chat, { text: donateText });
    }
}
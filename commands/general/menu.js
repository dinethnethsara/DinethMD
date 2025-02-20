const { categories } = require('../../config');
const moment = require('moment-timezone');

module.exports = {
    name: 'menu',
    alias: ['cmd', 'help', 'commands'],
    category: 'general',
    desc: 'Display bot menu and features',
    async execute(sock, msg, args) {
        const { pushName, sender } = msg;
        const time = moment().format('HH:mm:ss');

        let menuText = `*🤖 DINETH MD BOT MENU*\n\n`;
        menuText += `👋 Hi ${pushName}!\n`;
        menuText += `⏰ Time: ${time}\n\n`;

        // Add categories and commands
        for (const [key, category] of Object.entries(categories)) {
            menuText += `*${category.emoji} ${category.name}*\n`;
            for (const cmd of category.commands) {
                menuText += `  ⌁ .${cmd.cmd} - ${cmd.desc}\n`;
            }
            menuText += '\n';
        }

        menuText += `\n📝 Send .help <command> for detailed info\n`;
        menuText += `🔰 Powered by Dineth MD`;

        await sock.sendMessage(msg.chat, { text: menuText });
    }
}
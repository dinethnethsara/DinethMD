const { generateRandomHexColor } = require('../../utils/messageHandler');
const boxen = require('boxen');
const gradient = require('gradient-string');
const figlet = require('figlet');

module.exports = {
    name: 'menu',
    category: 'general',
    description: 'Display bot commands menu with beautiful formatting',
    async execute(msg, args, client) {
        const categories = {
            'Admin': '👑',
            'AI': '🤖',
            'Converter': '🔄',
            'Downloader': '📥',
            'File Manager': '📁',
            'Fun': '🎮',
            'Games': '🎲',
            'General': '⚡',
            'Group': '👥',
            'Media': '🎥',
            'Media Editor': '✨',
            'Search': '🔍',
            'Utility': '🛠️'
        };

        // Create ASCII art header
        let menuText = figlet.textSync('Dineth MD', {
            font: config.menuStyle.asciiArt.font,
            horizontalLayout: config.menuStyle.asciiArt.horizontalLayout,
            verticalLayout: config.menuStyle.asciiArt.verticalLayout
        });

        // Apply gradient to ASCII art
        if (config.menuStyle.useGradient) {
            menuText = gradient(...config.menuStyle.gradientColors)(menuText);
        }

        let fullMenu = '';
        if (config.menuStyle.useBoxen) {
            fullMenu = boxen(menuText, config.menuStyle.boxenOptions);
        } else {
            fullMenu = menuText;
        }

        fullMenu += '\n\n*🌟 Premium WhatsApp Bot by Dineth*\n\n';

        // Get all commands
        const commands = client.commands;

        // Organize commands by category
        const categoryCommands = {};
        commands.forEach(cmd => {
            if (!categoryCommands[cmd.category]) {
                categoryCommands[cmd.category] = [];
            }
            categoryCommands[cmd.category].push(cmd);
        });

        // Generate menu sections with enhanced styling
        for (const [category, emoji] of Object.entries(categories)) {
            const cmds = categoryCommands[category.toLowerCase()];
            if (cmds && cmds.length > 0) {
                fullMenu += `╭━━━ ${emoji} *${category}* ━━━╮\n`;
                cmds.forEach((cmd, index) => {
                    const isLast = index === cmds.length - 1;
                    fullMenu += isLast ? '┗━➤' : '┣━➤';
                    fullMenu += ` .${cmd.name}\n`;
                    if (cmd.description) {
                        fullMenu += `${isLast ? '    ' : '┃   '} ╰─ _${cmd.description}_\n`;
                    }
                });
                fullMenu += '╰' + '━'.repeat(20) + '╯\n\n';
            }
        }

        // Enhanced footer with decorative elements
        fullMenu += '╭' + '━'.repeat(30) + '╮\n';
        fullMenu += '┃ 📱 *Contact Owner*: .owner    ┃\n';
        fullMenu += '┃ 💖 *Support Development*: .donate ┃\n';
        fullMenu += '╰' + '━'.repeat(30) + '╯\n\n';
        fullMenu += gradient.rainbow('_Powered by Dineth MD_');

        // Send menu with enhanced preview
        await msg.reply({
            text: fullMenu,
            contextInfo: {
                externalAdReply: {
                    title: "✨ Dineth MD - Premium WhatsApp Bot ✨",
                    body: "🚀 Powerful Features | 🔥 24/7 Active | ⚡ Fast Response",
                    thumbnailUrl: "https://i.ibb.co/XjgQX5n/bot.jpg",
                    sourceUrl: "https://wa.me/+94741566800",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }
};
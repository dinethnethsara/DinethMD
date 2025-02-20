const { MessageType } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'autoreact',
    category: 'general',
    description: 'Configure automatic reactions to messages',
    async execute(msg, args, client) {
        if (!msg.isGroup) {
            return msg.reply('⚠️ This command can only be used in groups!');
        }

        // Check if user has admin rights
        const isAdmin = await client.isAdmin(msg.from, msg.sender);
        if (!isAdmin) {
            return msg.reply('⚠️ Only admins can configure auto-reactions!');
        }

        // Available reaction patterns
        const reactionPatterns = {
            greetings: ['hi', 'hello', 'hey', 'hola'],
            thanks: ['thank', 'thanks', 'tq', 'ty'],
            goodbye: ['bye', 'goodbye', 'cya', 'gtg'],
            praise: ['good', 'great', 'awesome', 'nice', 'amazing'],
            laugh: ['haha', 'lol', 'lmao', 'rofl']
        };

        // Corresponding reactions
        const reactions = {
            greetings: '👋',
            thanks: '🙏',
            goodbye: '👋',
            praise: '🌟',
            laugh: '😂'
        };

        // Store group settings
        if (!client.groupSettings) {
            client.groupSettings = new Map();
        }

        if (args.length === 0) {
            const status = client.groupSettings.get(msg.from)?.autoReact ? 'enabled' : 'disabled';
            return msg.reply(
                '🤖 *Auto-React Configuration*\n\n' +
                `Current Status: ${status}\n\n` +
                'Commands:\n' +
                '• .autoreact on - Enable auto-reactions\n' +
                '• .autoreact off - Disable auto-reactions\n' +
                '• .autoreact patterns - View reaction patterns'
            );
        }

        const command = args[0].toLowerCase();

        switch (command) {
            case 'on':
                client.groupSettings.set(msg.from, { ...client.groupSettings.get(msg.from), autoReact: true });
                return msg.reply('✅ Auto-reactions have been enabled!');

            case 'off':
                client.groupSettings.set(msg.from, { ...client.groupSettings.get(msg.from), autoReact: false });
                return msg.reply('❌ Auto-reactions have been disabled!');

            case 'patterns':
                let patternList = '📝 *Available Reaction Patterns*\n\n';
                for (const [category, patterns] of Object.entries(reactionPatterns)) {
                    patternList += `${reactions[category]} *${category}*:\n`;
                    patternList += `Keywords: ${patterns.join(', ')}\n\n`;
                }
                return msg.reply(patternList);

            default:
                return msg.reply('❌ Invalid command! Use .autoreact for help.');
        }
    },

    // Handler for auto-reactions
    async handleMessage(msg, client) {
        if (!msg.isGroup) return;

        const groupSettings = client.groupSettings?.get(msg.from);
        if (!groupSettings?.autoReact) return;

        const text = msg.body.toLowerCase();

        // Check message against patterns
        for (const [category, patterns] of Object.entries(this.reactionPatterns)) {
            if (patterns.some(pattern => text.includes(pattern))) {
                try {
                    await msg.react(this.reactions[category]);
                    break; // Only react once per message
                } catch (error) {
                    console.error('Error sending reaction:', error);
                }
            }
        }
    }
};
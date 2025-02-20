const { MessageType } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'welcome',
    category: 'general',
    description: 'Configure welcome messages for new members',
    async execute(msg, args, client) {
        if (!msg.isGroup) {
            return msg.reply('⚠️ This command can only be used in groups!');
        }

        // Check if user has admin rights
        const isAdmin = await client.isAdmin(msg.from, msg.sender);
        if (!isAdmin) {
            return msg.reply('⚠️ Only admins can configure welcome messages!');
        }

        // Initialize group settings if not exists
        if (!client.groupSettings) {
            client.groupSettings = new Map();
        }

        const currentSettings = client.groupSettings.get(msg.from) || {};

        if (args.length === 0) {
            return msg.reply(
                '👋 *Welcome Message Configuration*\n\n' +
                `Status: ${currentSettings.welcome ? '✅ Enabled' : '❌ Disabled'}\n` +
                `Current Message: ${currentSettings.welcomeMessage || 'Default'}\n\n` +
                'Commands:\n' +
                '• .welcome on - Enable welcome messages\n' +
                '• .welcome off - Disable welcome messages\n' +
                '• .welcome set <message> - Set custom welcome message\n' +
                '• .welcome preview - Preview current welcome message\n\n' +
                'Variables:\n' +
                '{member} - Member name\n' +
                '{group} - Group name\n' +
                '{desc} - Group description\n' +
                '{rules} - Group rules'
            );
        }

        const command = args[0].toLowerCase();

        switch (command) {
            case 'on':
                client.groupSettings.set(msg.from, {
                    ...currentSettings,
                    welcome: true
                });
                return msg.reply('✅ Welcome messages have been enabled!');

            case 'off':
                client.groupSettings.set(msg.from, {
                    ...currentSettings,
                    welcome: false
                });
                return msg.reply('❌ Welcome messages have been disabled!');

            case 'set':
                if (args.length < 2) {
                    return msg.reply('⚠️ Please provide a welcome message!');
                }
                const welcomeMessage = args.slice(1).join(' ');
                client.groupSettings.set(msg.from, {
                    ...currentSettings,
                    welcomeMessage
                });
                return msg.reply('✅ Welcome message has been updated!');

            case 'preview':
                const metadata = await client.groupMetadata(msg.from);
                const previewMessage = this.formatWelcomeMessage(
                    currentSettings.welcomeMessage,
                    msg.sender,
                    metadata
                );
                return msg.reply(previewMessage);

            default:
                return msg.reply('❌ Invalid command! Use .welcome for help.');
        }
    },

    // Format welcome message with variables
    formatWelcomeMessage(message, member, groupMetadata) {
        const defaultMessage = '👋 Welcome {member} to {group}!\n\n📝 Group Description:\n{desc}\n\n📜 Rules:\n{rules}';
        message = message || defaultMessage;

        return message
            .replace('{member}', `@${member.split('@')[0]}`)
            .replace('{group}', groupMetadata.subject)
            .replace('{desc}', groupMetadata.desc || 'No description')
            .replace('{rules}', groupMetadata.rules || 'No rules set');
    },

    // Handler for group participant updates
    async handleParticipantUpdate(update, client) {
        const { id, participants, action } = update;
        if (action !== 'add') return;

        const groupSettings = client.groupSettings?.get(id);
        if (!groupSettings?.welcome) return;

        try {
            const metadata = await client.groupMetadata(id);
            for (const participant of participants) {
                const welcomeMessage = this.formatWelcomeMessage(
                    groupSettings.welcomeMessage,
                    participant,
                    metadata
                );

                await client.sendMessage(id, {
                    text: welcomeMessage,
                    mentions: [participant]
                });
            }
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    }
};
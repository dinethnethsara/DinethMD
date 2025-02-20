const { MessageType } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'statusviewer',
    category: 'general',
    description: 'Configure automatic status viewing and notifications',
    async execute(msg, args, client) {
        if (!msg.isGroup) {
            return msg.reply('⚠️ This command can only be used in groups!');
        }

        // Check if user has admin rights
        const isAdmin = await client.isAdmin(msg.from, msg.sender);
        if (!isAdmin) {
            return msg.reply('⚠️ Only admins can configure status viewer settings!');
        }

        // Initialize group settings if not exists
        if (!client.groupSettings) {
            client.groupSettings = new Map();
        }

        if (args.length === 0) {
            const settings = client.groupSettings.get(msg.from) || {};
            return msg.reply(
                '👁️ *Status Viewer Configuration*\n\n' +
                `Auto Notify: ${settings.statusNotify ? '✅ Enabled' : '❌ Disabled'}\n` +
                `Save Status: ${settings.saveStatus ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                'Commands:\n' +
                '• .statusviewer notify on/off - Toggle status notifications\n' +
                '• .statusviewer save on/off - Toggle status saving\n' +
                '• .statusviewer list - View recent status updates'
            );
        }

        const command = args[0].toLowerCase();
        const setting = args[1]?.toLowerCase();

        switch (command) {
            case 'notify':
                if (setting !== 'on' && setting !== 'off') {
                    return msg.reply('❌ Please specify on/off for notifications!');
                }
                const currentSettings = client.groupSettings.get(msg.from) || {};
                client.groupSettings.set(msg.from, {
                    ...currentSettings,
                    statusNotify: setting === 'on'
                });
                return msg.reply(`✅ Status notifications have been ${setting === 'on' ? 'enabled' : 'disabled'}!`);

            case 'save':
                if (setting !== 'on' && setting !== 'off') {
                    return msg.reply('❌ Please specify on/off for status saving!');
                }
                const settings = client.groupSettings.get(msg.from) || {};
                client.groupSettings.set(msg.from, {
                    ...settings,
                    saveStatus: setting === 'on'
                });
                return msg.reply(`✅ Status saving has been ${setting === 'on' ? 'enabled' : 'disabled'}!`);

            case 'list':
                const recentStatus = client.statusCache?.get(msg.from) || [];
                if (recentStatus.length === 0) {
                    return msg.reply('📱 No recent status updates found!');
                }
                let statusList = '📱 *Recent Status Updates*\n\n';
                recentStatus.forEach((status, index) => {
                    statusList += `${index + 1}. ${status.sender}\n`;
                    statusList += `Type: ${status.type}\n`;
                    statusList += `Time: ${new Date(status.timestamp).toLocaleString()}\n\n`;
                });
                return msg.reply(statusList);

            default:
                return msg.reply('❌ Invalid command! Use .statusviewer for help.');
        }
    },

    // Handler for status updates
    async handleStatus(status, client) {
        const groups = Array.from(client.groupSettings.keys());
        for (const groupId of groups) {
            const settings = client.groupSettings.get(groupId);
            if (settings?.statusNotify) {
                try {
                    // Initialize status cache
                    if (!client.statusCache) {
                        client.statusCache = new Map();
                    }

                    // Update status cache
                    const groupCache = client.statusCache.get(groupId) || [];
                    groupCache.unshift({
                        sender: status.participant,
                        type: status.type,
                        timestamp: Date.now()
                    });

                    // Keep only last 10 status updates
                    if (groupCache.length > 10) {
                        groupCache.pop();
                    }

                    client.statusCache.set(groupId, groupCache);

                    // Notify group if enabled
                    if (settings.statusNotify) {
                        await client.sendMessage(groupId, {
                            text: `📱 *New Status Update*\n\nFrom: ${status.participant}\nType: ${status.type}`
                        });
                    }
                } catch (error) {
                    console.error('Error handling status update:', error);
                }
            }
        }
    }
};
const config = require('../../config');

module.exports = {
    name: 'admin',
    alias: ['botadmin'],
    category: 'admin',
    desc: 'Manage bot administrators',
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        const isOwner = sender === config.ownerNumber;

        if (!isOwner) {
            return await sock.sendMessage(sender, {
                text: '❌ *Access Denied*\n\n• This command is only for bot owner\n\n🔰 Powered by Dineth MD'
            });
        }

        if (!args[0]) {
            return await sock.sendMessage(sender, {
                text: `*👑 Admin Commands*\n\n` +
                      `• .admin list - Show all admins\n` +
                      `• .admin add <@user> - Add new admin\n` +
                      `• .admin remove <@user> - Remove admin\n\n` +
                      `Example: .admin add @user\n\n` +
                      `🔰 Powered by Dineth MD`
            });
        }

        const action = args[0].toLowerCase();
        
        switch(action) {
            case 'list':
                const adminList = config.admins.map(admin => `• @${admin.split('@')[0]}`).join('\n');
                await sock.sendMessage(sender, {
                    text: `*👑 Bot Administrators*\n\n${adminList}\n\n🔰 Powered by Dineth MD`,
                    mentions: config.admins
                });
                break;

            case 'add':
                // Implementation for adding admin
                await sock.sendMessage(sender, {
                    text: '✅ Admin management feature will be implemented soon!\n\n🔰 Powered by Dineth MD'
                });
                break;

            case 'remove':
                // Implementation for removing admin
                await sock.sendMessage(sender, {
                    text: '✅ Admin management feature will be implemented soon!\n\n🔰 Powered by Dineth MD'
                });
                break;

            default:
                await sock.sendMessage(sender, {
                    text: '❌ Invalid action! Use .admin for available options.\n\n🔰 Powered by Dineth MD'
                });
        }
    }
}
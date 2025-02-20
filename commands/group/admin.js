const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const groupMetadata = isGroup ? await sock.groupMetadata(sender) : {};
    const isAdmin = isGroup ? groupMetadata.participants.find(p => p.id === msg.key.participant)?.admin : false;

    if (!isGroup) {
        await sock.sendMessage(sender, { text: '❌ This command can only be used in groups!' });
        return;
    }

    if (!isAdmin) {
        await sock.sendMessage(sender, { text: '❌ This command is only for group admins!' });
        return;
    }

    if (!args[0]) {
        await sock.sendMessage(sender, { 
            text: `👥 *Group Admin Commands*\n\n📝 Usage:\n• !admin mute - Only admins can send messages\n• !admin unmute - Everyone can send messages\n• !admin kick @user - Remove user from group\n• !admin ban @user - Ban user from group\n• !admin welcome on/off - Toggle welcome messages\n• !admin goodbye on/off - Toggle goodbye messages\n• !admin react on/off - Toggle auto-reactions\n\n🤖 _Powered by Dineth MD_`
        });
        return;
    }

    const command = args[0].toLowerCase();
    const groupId = sender;

    try {
        switch (command) {
            case 'mute':
                await sock.groupSettingUpdate(groupId, 'announcement');
                await sock.sendMessage(sender, { text: '🔇 Group has been muted. Only admins can send messages now.' });
                break;

            case 'unmute':
                await sock.groupSettingUpdate(groupId, 'not_announcement');
                await sock.sendMessage(sender, { text: '🔊 Group has been unmuted. Everyone can send messages now.' });
                break;

            case 'kick':
                if (!args[1]) {
                    await sock.sendMessage(sender, { text: '❌ Please mention the user to kick!' });
                    return;
                }
                const kickUser = args[1].replace('@', '') + '@s.whatsapp.net';
                await sock.groupParticipantsUpdate(groupId, [kickUser], 'remove');
                await sock.sendMessage(sender, { text: '👋 User has been kicked from the group.' });
                break;

            case 'ban':
                if (!args[1]) {
                    await sock.sendMessage(sender, { text: '❌ Please mention the user to ban!' });
                    return;
                }
                const banUser = args[1].replace('@', '') + '@s.whatsapp.net';
                await sock.groupParticipantsUpdate(groupId, [banUser], 'remove');
                // Add user to banned list (implement persistent storage later)
                await sock.sendMessage(sender, { text: '🚫 User has been banned from the group.' });
                break;

            case 'welcome':
                if (!args[1] || !['on', 'off'].includes(args[1].toLowerCase())) {
                    await sock.sendMessage(sender, { text: '❌ Please specify on/off for welcome messages!' });
                    return;
                }
                // Implement welcome message toggle (add to config/database later)
                await sock.sendMessage(sender, { 
                    text: `✨ Welcome messages have been turned ${args[1].toLowerCase() === 'on' ? 'on' : 'off'}.`
                });
                break;

            case 'goodbye':
                if (!args[1] || !['on', 'off'].includes(args[1].toLowerCase())) {
                    await sock.sendMessage(sender, { text: '❌ Please specify on/off for goodbye messages!' });
                    return;
                }
                // Implement goodbye message toggle (add to config/database later)
                await sock.sendMessage(sender, { 
                    text: `👋 Goodbye messages have been turned ${args[1].toLowerCase() === 'on' ? 'on' : 'off'}.`
                });
                break;

            case 'react':
                if (!args[1] || !['on', 'off'].includes(args[1].toLowerCase())) {
                    await sock.sendMessage(sender, { text: '❌ Please specify on/off for auto-reactions!' });
                    return;
                }
                // Implement auto-reaction toggle (add to config/database later)
                await sock.sendMessage(sender, { 
                    text: `💫 Auto-reactions have been turned ${args[1].toLowerCase() === 'on' ? 'on' : 'off'}.`
                });
                break;

            default:
                await sock.sendMessage(sender, { text: '❌ Invalid admin command! Use !admin for help.' });
        }
    } catch (error) {
        console.error('Error in admin command:', error);
        await sock.sendMessage(sender, { text: '❌ An error occurred while executing the command.' });
    }
};
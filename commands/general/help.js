const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    
    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: `❓ *Help Command Usage*

To get detailed information about a command, use:
!help <command_name>

Example:
!help ytv

ℹ️ You can also use !menu to see all available commands.` 
            });
            return;
        }

        const commandName = args[0].toLowerCase();
        let commandFound = false;
        let commandInfo = '';

        // Search for the command in all categories
        for (const [categoryKey, category] of Object.entries(config.categories)) {
            const command = category.commands.find(cmd => cmd.cmd === commandName);
            if (command) {
                commandInfo = `${category.emoji} *${command.cmd.toUpperCase()} Command*

`;
                commandInfo += `📝 Description: ${command.desc}
`;
                commandInfo += `🔰 Category: ${category.name}

`;

                // Add specific usage instructions based on command
                switch (commandName) {
                    case 'ytv':
                        commandInfo += `Usage: !ytv <youtube_url>\nDownloads YouTube videos in the highest available quality.`;
                        break;
                    case 'sticker':
                        commandInfo += `Usage: !sticker\nSend this command as a caption with image/video to create a sticker.`;
                        break;
                    case 'kick':
                        commandInfo += `Usage: !kick @user\nKicks the mentioned user from the group. Requires admin privileges.`;
                        break;
                    default:
                        commandInfo += `Usage: !${commandName}`;
                }

                commandFound = true;
                break;
            }
        }

        if (!commandFound) {
            await sock.sendMessage(sender, { 
                text: `❌ Command '${commandName}' not found.\nUse !menu to see all available commands.` 
            });
            return;
        }

        await sock.sendMessage(sender, { text: commandInfo });

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(sender, { text: 'An error occurred while fetching help information.' });
    }
};
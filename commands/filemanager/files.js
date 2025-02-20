const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    name: 'files',
    alias: ['fm', 'filemanager'],
    category: 'filemanager',
    desc: 'Manage files and directories',
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        const isAdmin = config.admins.includes(sender);

        if (!isAdmin) {
            return await sock.sendMessage(sender, {
                text: '❌ *Access Denied*\n\n• This command is only for administrators\n\n🔰 Powered by Dineth MD'
            });
        }

        if (!args[0]) {
            return await sock.sendMessage(sender, {
                text: `*📁 File Manager Commands*\n\n` +
                      `• .files list - List files in current directory\n` +
                      `• .files info <filename> - Get file information\n` +
                      `• .files size - Show storage usage\n\n` +
                      `Example: .files list\n\n` +
                      `🔰 Powered by Dineth MD`
            });
        }

        const action = args[0].toLowerCase();
        const workDir = path.join(__dirname, '../../temp');

        switch(action) {
            case 'list':
                try {
                    if (!fs.existsSync(workDir)) {
                        fs.mkdirSync(workDir, { recursive: true });
                    }

                    const files = fs.readdirSync(workDir);
                    const fileList = files.map(file => {
                        const stats = fs.statSync(path.join(workDir, file));
                        const size = (stats.size / 1024).toFixed(2);
                        return `• ${file} (${size} KB)`;
                    }).join('\n');

                    await sock.sendMessage(sender, {
                        text: `*📁 Files in Temp Directory*\n\n${fileList || 'No files found'}\n\n🔰 Powered by Dineth MD`
                    });
                } catch (error) {
                    await sock.sendMessage(sender, {
                        text: '❌ Failed to list files\n\n🔰 Powered by Dineth MD'
                    });
                }
                break;

            case 'info':
                if (!args[1]) {
                    return await sock.sendMessage(sender, {
                        text: '❌ Please specify a filename\n\n🔰 Powered by Dineth MD'
                    });
                }

                try {
                    const filePath = path.join(workDir, args[1]);
                    if (!fs.existsSync(filePath)) {
                        return await sock.sendMessage(sender, {
                            text: '❌ File not found\n\n🔰 Powered by Dineth MD'
                        });
                    }

                    const stats = fs.statSync(filePath);
                    const info = `*📄 File Information*\n\n` +
                               `• Name: ${args[1]}\n` +
                               `• Size: ${(stats.size / 1024).toFixed(2)} KB\n` +
                               `• Created: ${stats.birthtime.toLocaleString()}\n` +
                               `• Modified: ${stats.mtime.toLocaleString()}`;

                    await sock.sendMessage(sender, {
                        text: `${info}\n\n🔰 Powered by Dineth MD`
                    });
                } catch (error) {
                    await sock.sendMessage(sender, {
                        text: '❌ Failed to get file information\n\n🔰 Powered by Dineth MD'
                    });
                }
                break;

            case 'size':
                try {
                    if (!fs.existsSync(workDir)) {
                        fs.mkdirSync(workDir, { recursive: true });
                    }

                    let totalSize = 0;
                    const files = fs.readdirSync(workDir);
                    files.forEach(file => {
                        const stats = fs.statSync(path.join(workDir, file));
                        totalSize += stats.size;
                    });

                    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
                    await sock.sendMessage(sender, {
                        text: `*💾 Storage Information*\n\n` +
                             `• Total Files: ${files.length}\n` +
                             `• Total Size: ${sizeInMB} MB\n\n` +
                             `🔰 Powered by Dineth MD`
                    });
                } catch (error) {
                    await sock.sendMessage(sender, {
                        text: '❌ Failed to get storage information\n\n🔰 Powered by Dineth MD'
                    });
                }
                break;

            default:
                await sock.sendMessage(sender, {
                    text: '❌ Invalid action! Use .files for available options.\n\n🔰 Powered by Dineth MD'
                });
        }
    }
}
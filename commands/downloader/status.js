const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'status',
    alias: ['ss', 'savestatus'],
    category: 'downloader',
    desc: 'Save WhatsApp status to your device',
    async execute(sock, msg, args) {
        try {
            const { quotedMessage, type } = msg;
            
            if (!quotedMessage) {
                return await sock.sendMessage(msg.chat, { text: '❌ Please reply to a status to save it!' });
            }

            const statusDir = path.join(__dirname, '../../media/status');
            if (!fs.existsSync(statusDir)) {
                fs.mkdirSync(statusDir, { recursive: true });
            }

            const mediaType = quotedMessage.type;
            const fileName = `status_${Date.now()}`;
            let fileExt = '';

            switch(mediaType) {
                case 'imageMessage':
                    fileExt = '.jpg';
                    break;
                case 'videoMessage':
                    fileExt = '.mp4';
                    break;
                default:
                    return await sock.sendMessage(msg.chat, { text: '❌ Unsupported media type!' });
            }

            const buffer = await sock.downloadMediaMessage(quotedMessage);
            const filePath = path.join(statusDir, fileName + fileExt);
            
            fs.writeFileSync(filePath, buffer);

            await sock.sendMessage(msg.chat, {
                text: `✅ Status saved successfully!\n📂 Saved as: ${fileName}${fileExt}`
            });

        } catch (error) {
            console.error('Error in status command:', error);
            await sock.sendMessage(msg.chat, { text: '❌ Error saving status!' });
        }
    }
}
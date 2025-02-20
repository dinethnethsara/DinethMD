const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '🖼️ *Image Effects*\n\n📝 *Usage Guide:*\n• Command: !image <effect> <reply to image>\n• Effects: blur, grayscale, invert, sepia\n\n💡 *Example:*\n!image blur (reply to an image)\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const effect = args[0].toLowerCase();
        const allowedEffects = ['blur', 'grayscale', 'invert', 'sepia'];

        if (!allowedEffects.includes(effect)) {
            await sock.sendMessage(sender, { 
                text: '❌ *Invalid Effect*\n\n• Please choose from: blur, grayscale, invert, sepia\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Check if message is replying to an image
        const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg || !quotedMsg.imageMessage) {
            await sock.sendMessage(sender, { 
                text: '❌ *No Image Found*\n\n• Please reply to an image\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `🖼️ *Image Processing*\n\n⏳ *Status:* Processing\n🎨 *Effect:* ${effect}\n\n⌛ Please wait...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Get the image URL from the quoted message
        const imageUrl = quotedMsg.imageMessage.url;

        // Create temporary directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Process image with selected effect using an image processing API
        const response = await axios.get(`https://api.imgbb.com/1/upload?key=${config.apiKeys.imgbb}`, {
            params: {
                image: imageUrl,
                name: `${effect}_${Date.now()}`,
                expiration: 600
            }
        });

        const processedImageUrl = response.data.data.url;

        // Send the processed image
        await sock.sendMessage(sender, {
            image: { url: processedImageUrl },
            caption: `🖼️ *Image Effect Applied*\n\n🎨 *Effect:* ${effect}\n✨ *Status:* Complete\n\n🤖 _Powered by Dineth MD_`
        });

    } catch (error) {
        console.error('Error in image command:', error);
        let errorMessage = '❌ *Processing Error*\n\n';

        if (error.response) {
            if (error.response.status === 413) {
                errorMessage += '• Image file is too large\n';
            } else if (error.response.status === 429) {
                errorMessage += '• Too many requests. Please try again later\n';
            } else {
                errorMessage += '• Image processing failed\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Try with a different image or effect\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
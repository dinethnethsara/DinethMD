const { createAsciiArt, createGradientArt, getRandomTemplate, wrapWithTemplate } = require('../../utils/asciiArtHandler');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '🎨 *ASCII Art Generator*\n\n📝 *Usage Guide:*\n• Command: !ascii <text>\n• Optional: !ascii <text> -f <font>\n\n💫 *Available Fonts:*\n• Standard\n• Big\n• Slant\n• Block\n• Banner\n\n💡 *Example:*\n!ascii Hello\n!ascii Cool -f Block\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Parse font option
        let font = 'Standard';
        let text = args.join(' ');
        
        if (text.includes('-f')) {
            const parts = text.split('-f');
            text = parts[0].trim();
            font = parts[1].trim();
        }

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `🎨 *ASCII Art*\n\n⏳ *Status:* Generating\n📝 *Text:* ${text}\n✨ *Font:* ${font}\n\n⌛ Please wait...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Generate ASCII art with random template and gradient
        const asciiArt = await createAsciiArt(text, font);
        const template = getRandomTemplate();
        const artWithTemplate = wrapWithTemplate(asciiArt, template);

        // Format the final message
        const finalArt = `🎨 *ASCII Art Result*\n\n${artWithTemplate}\n\n🤖 _Powered by Dineth MD_`;

        await sock.sendMessage(sender, { text: finalArt });

    } catch (error) {
        console.error('Error in ascii command:', error);
        let errorMessage = '❌ *ASCII Art Error*\n\n';

        if (error.message.includes('font')) {
            errorMessage += '• Invalid font selected\n';
        } else {
            errorMessage += '• Failed to generate ASCII art\n';
        }

        errorMessage += '\n💡 *Tip:* Try using a different font or shorter text\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
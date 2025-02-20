const axios = require('axios');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '🎭 *Anime Image Search*\n\n📝 *Usage Guide:*\n• Command: !anime <category>\n• Categories: waifu, neko, shinobu, megumin\n\n💡 *Example:*\n!anime waifu\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const category = args[0].toLowerCase();
        const allowedCategories = ['waifu', 'neko', 'shinobu', 'megumin'];

        if (!allowedCategories.includes(category)) {
            await sock.sendMessage(sender, { 
                text: '❌ *Invalid Category*\n\n• Please choose from: waifu, neko, shinobu, megumin\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `🎭 *Anime Image*\n\n⏳ *Status:* Fetching\n🔍 *Category:* ${category}\n\n⌛ Please wait...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Fetch image from waifu.pics API (SFW endpoint)
        const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
        const imageUrl = response.data.url;

        // Send the image
        await sock.sendMessage(sender, {
            image: { url: imageUrl },
            caption: `🎭 *Anime Image*\n\n📊 *Category:* ${category}\n✨ *Source:* waifu.pics\n\n🤖 _Powered by Dineth MD_`
        });

    } catch (error) {
        console.error('Error in anime command:', error);
        let errorMessage = '❌ *Image Error*\n\n';

        if (error.response) {
            if (error.response.status === 404) {
                errorMessage += '• Image not found\n';
            } else if (error.response.status === 429) {
                errorMessage += '• Too many requests. Please try again later\n';
            } else {
                errorMessage += '• API error occurred\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Try a different category\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    
    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { text: '❌ Please provide a URL to preview!\n\n🤖 Powered by Dineth MD' });
            return;
        }

        const url = args[0];

        // Send processing message
        await sock.sendMessage(sender, { text: '⏳ Generating URL preview...\n\n🤖 Powered by Dineth MD' });

        // Fetch webpage content
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const $ = cheerio.load(response.data);

        // Extract metadata
        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || 'No Title';
        const description = $('meta[name="description"]').attr('content') || 
                          $('meta[property="og:description"]').attr('content') || 
                          'No description available';
        const image = $('meta[property="og:image"]').attr('content') || 
                     $('meta[property="twitter:image"]').attr('content');

        // Prepare preview message
        let previewText = `🔗 *URL Preview*\n\n📝 Title: ${title}\n\n📄 Description: ${description}\n\n🌐 URL: ${url}\n\n🤖 Powered by Dineth MD`;

        if (image) {
            // Send preview with image
            await sock.sendMessage(sender, {
                image: { url: image },
                caption: previewText
            });
        } else {
            // Send text-only preview
            await sock.sendMessage(sender, { text: previewText });
        }

    } catch (error) {
        console.error('Error in preview command:', error);
        await sock.sendMessage(sender, { text: '❌ An error occurred while generating the preview.\n\n🤖 Powered by Dineth MD' });
    }
};
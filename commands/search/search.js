const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
    name: 'search',
    alias: ['find'],
    category: 'search',
    desc: 'Search for images, lyrics, or Wikipedia articles',
    async execute(sock, msg, args) {
        if (!args[0]) {
            return await sock.sendMessage(msg.chat, {
                text: `*🔍 Search Commands*\n\n` +
                      `• .search image <query> - Search for images\n` +
                      `• .search lyrics <song name> - Search for song lyrics\n` +
                      `• .search wiki <query> - Search Wikipedia articles\n\n` +
                      `Example: .search wiki artificial intelligence\n\n` +
                      `🔰 Powered by Dineth MD`
            });
        }

        const searchType = args[0].toLowerCase();
        const query = args.slice(1).join(' ');

        if (!query) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ Please provide a search query!'
            });
        }

        switch(searchType) {
            case 'image':
                try {
                    const imageResponse = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_API_KEY}`);
                    const image = imageResponse.data.results[0];
                    
                    if (image) {
                        await sock.sendMessage(msg.chat, {
                            image: { url: image.urls.regular },
                            caption: `📸 *${image.alt_description || 'Image'}*\n👤 By: ${image.user.name}\n\n🔰 Powered by Dineth MD`
                        });
                    } else {
                        await sock.sendMessage(msg.chat, { text: '❌ No images found!' });
                    }
                } catch (error) {
                    await sock.sendMessage(msg.chat, { text: '❌ Failed to search for images' });
                }
                break;

            case 'lyrics':
                try {
                    const lyricsResponse = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
                    const lyrics = lyricsResponse.data.lyrics;

                    await sock.sendMessage(msg.chat, {
                        text: `*🎵 ${query}*\n\n${lyrics}\n\n🔰 Powered by Dineth MD`
                    });
                } catch (error) {
                    await sock.sendMessage(msg.chat, { text: '❌ Lyrics not found!' });
                }
                break;

            case 'wiki':
                try {
                    const wikiResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                    const summary = wikiResponse.data.extract;

                    await sock.sendMessage(msg.chat, {
                        text: `*📚 ${wikiResponse.data.title}*\n\n${summary}\n\n🔰 Powered by Dineth MD`
                    });
                } catch (error) {
                    await sock.sendMessage(msg.chat, { text: '❌ Wikipedia article not found!' });
                }
                break;

            default:
                await sock.sendMessage(msg.chat, {
                    text: '❌ Invalid search type! Use .search for available options.'
                });
        }
    }
}
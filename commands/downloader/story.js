const axios = require('axios');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '📸 *Instagram Story Downloader*\n\n📝 *Usage Guide:*\n• Command: !story <username>\n• Supports: Instagram stories\n\n💡 *Example:*\n!story username\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const username = args[0];

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `📸 *Instagram Story*\n\n⏳ *Status:* Processing\n👤 *Username:* ${username}\n\n⌛ Please wait while I fetch the stories...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Make API request to get stories
        const response = await axios.get(`https://api.example.com/instagram/stories/${username}`, {
            headers: {
                'Authorization': `Bearer ${config.apiKeys.instagram}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.stories && response.data.stories.length > 0) {
            // Send success message
            await sock.sendMessage(sender, {
                text: `📸 *Stories Found*\n\n👤 *Username:* ${username}\n📊 *Count:* ${response.data.stories.length} stories\n\n✨ *Status:* Downloading...\n\n🤖 _Powered by Dineth MD_`
            });

            // Download and send each story
            for (const story of response.data.stories) {
                if (story.type === 'image') {
                    await sock.sendMessage(sender, {
                        image: { url: story.url },
                        caption: `📸 *Instagram Story*\n\n⏰ *Posted:* ${story.timestamp}\n\n🤖 _Powered by Dineth MD_`
                    });
                } else if (story.type === 'video') {
                    await sock.sendMessage(sender, {
                        video: { url: story.url },
                        caption: `🎥 *Instagram Story*\n\n⏰ *Posted:* ${story.timestamp}\n\n🤖 _Powered by Dineth MD_`
                    });
                }
            }
        } else {
            await sock.sendMessage(sender, {
                text: '❌ *No Stories Found*\n\n• User has no active stories\n• Or account might be private\n\n🤖 _Powered by Dineth MD_'
            });
        }

    } catch (error) {
        console.error('Error in story command:', error);
        let errorMessage = '❌ *Download Error*\n\n';

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage += '• Invalid API token\n';
            } else if (error.response.status === 404) {
                errorMessage += '• User not found\n';
            } else if (error.response.status === 429) {
                errorMessage += '• Too many requests\n';
            } else {
                errorMessage += '• Instagram API error\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Make sure the username is correct and account is public\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
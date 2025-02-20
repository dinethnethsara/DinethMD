const axios = require('axios');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    if (!args.length) {
        await sock.sendMessage(sender, { text: '❌ Please provide a message to chat with the AI!\n\nExample: !chat How are you?' });
        return;
    }

    try {
        // Send typing indicator
        await sock.sendPresenceUpdate('composing', sender);

        const userMessage = args.join(' ');

        // Make API request to chat endpoint
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: userMessage
            }],
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${config.apiKeys.openai}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content.trim();

        // Format and send the response
        const formattedResponse = `🤖 *AI Response:*\n\n${aiResponse}\n\n_Powered by ${config.botName}_`;

        await sock.sendMessage(sender, { text: formattedResponse });

    } catch (error) {
        console.error('Error in chat command:', error);
        await sock.sendMessage(sender, { 
            text: '❌ An error occurred while processing your message.\n\n🤖 Powered by Dineth MD' 
        });
    } finally {
        // Clear typing indicator
        await sock.sendPresenceUpdate('paused', sender);
    }
};
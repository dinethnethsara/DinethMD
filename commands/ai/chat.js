const { Configuration, OpenAIApi } = require('openai');
const config = require('../../config');

module.exports = {
    name: 'chat',
    category: 'ai',
    description: 'Chat with AI assistant powered by GPT',
    async execute(msg, args, client) {
        const sender = msg.key.remoteJid;

        try {
            if (!args.length) {
                await client.sendMessage(sender, { 
                    text: '❌ Please provide a message to chat with AI!\n\nExample: !chat What is artificial intelligence?' 
                });
                return;
            }

            const userMessage = args.join(' ');

            // Initialize OpenAI configuration
            const configuration = new Configuration({
                apiKey: config.apiKeys.openai,
            });
            const openai = new OpenAIApi(configuration);

            // Send typing indicator
            await client.sendPresenceUpdate('composing', sender);

            // Get AI response
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful AI assistant.' },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const aiResponse = response.data.choices[0].message.content.trim();

            // Format and send the response
            const formattedResponse = `🤖 *AI Response*\n\n${aiResponse}\n\n_Powered by Dineth MD_`;

            await client.sendMessage(sender, { 
                text: formattedResponse,
                contextInfo: {
                    externalAdReply: {
                        title: "✨ Dineth MD - AI Chat",
                        body: "Ask me anything!",
                        thumbnailUrl: "https://i.ibb.co/XjgQX5n/bot.jpg",
                        sourceUrl: "https://wa.me/+94741566800",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });

        } catch (error) {
            console.error('Error in AI chat:', error);
            await client.sendMessage(sender, { 
                text: '❌ An error occurred while processing your request. Please try again later.'
            });
        }
    }
};
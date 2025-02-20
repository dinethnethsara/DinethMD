const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;
    
    try {
        // Check if message is from a group
        if (!msg.key.participant) {
            await sock.sendMessage(sender, { text: '❌ This command can only be used in groups!' });
            return;
        }

        // Check command format
        if (args.length < 3) {
            await sock.sendMessage(sender, { 
                text: '❌ Please use the correct format:\n!poll <question> | <option1> | <option2> | ...'                + '\n\nExample:\n!poll What\'s your favorite color? | Red | Blue | Green'
            });
            return;
        }

        // Parse poll data
        const pollData = args.join(' ').split('|').map(item => item.trim());
        const question = pollData[0];
        const options = pollData.slice(1);

        // Validate options (minimum 2, maximum 10)
        if (options.length < 2 || options.length > 10) {
            await sock.sendMessage(sender, { 
                text: '❌ Please provide between 2 and 10 options for the poll!'
            });
            return;
        }

        // Create poll message
        await sock.sendMessage(sender, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1
            },
            footer: `📊 Poll created by ${config.botName}`
        });

    } catch (error) {
        console.error('Error in poll command:', error);
        await sock.sendMessage(sender, { 
            text: '❌ An error occurred while creating the poll.\n\n🤖 Powered by Dineth MD'
        });
    }
};
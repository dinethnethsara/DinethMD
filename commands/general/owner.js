const config = require('../../config');

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    
    try {
        const ownerInfo = `👤 *Bot Owner Information*

📝 Name: ${config.ownerName}
📞 Contact: ${config.ownerNumber.join(', ')}

💫 Feel free to contact for:
• Bug reports
• Feature requests
• Business inquiries

_Note: Please be respectful and avoid spam_`;

        await sock.sendMessage(sender, { text: ownerInfo });
    } catch (error) {
        console.error('Error in owner command:', error);
        await sock.sendMessage(sender, { text: 'An error occurred while fetching owner information.' });
    }
};
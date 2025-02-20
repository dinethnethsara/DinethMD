const moment = require('moment-timezone');

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    const start = moment();
    
    try {
        await sock.sendMessage(sender, { text: '🏓 Pinging...' });
        const end = moment();
        const responseTime = end.diff(start, 'milliseconds');
        
        await sock.sendMessage(sender, {
            text: `🏓 Pong!
⚡ Response Time: ${responseTime}ms`
        });
    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(sender, { text: 'An error occurred while checking ping.' });
    }
};
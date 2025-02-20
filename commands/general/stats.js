const os = require('os');
const moment = require('moment-timezone');
const config = require('../../config');

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    
    try {
        // Calculate uptime
        const uptime = process.uptime();
        const uptimeStr = moment.duration(uptime, 'seconds').humanize();

        // Get system info
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsage = ((usedMem / totalMem) * 100).toFixed(2);

        // Get Node.js version
        const nodeVersion = process.version;

        // Format stats message
        const statsInfo = `📊 *${config.botName} Statistics*\n\n` +
            `⏰ Uptime: ${uptimeStr}\n` +
            `💻 Platform: ${os.platform()} ${os.arch()}\n` +
            `🔋 Memory Usage: ${memoryUsage}%\n` +
            `⚙️ Node.js: ${nodeVersion}\n\n` +
            `🤖 Bot Info:\n` +
            `• Name: ${config.botName}\n` +
            `• Owner: ${config.ownerName}\n` +
            `• Commands: ${Object.values(config.categories).reduce((acc, cat) => acc + cat.commands.length, 0)}\n` +
            `• Categories: ${Object.keys(config.categories).length}`;

        await sock.sendMessage(sender, { text: statsInfo });
    } catch (error) {
        console.error('Error in stats command:', error);
        await sock.sendMessage(sender, { text: 'An error occurred while fetching bot statistics.' });
    }
};
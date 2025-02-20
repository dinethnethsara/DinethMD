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
        const cpuUsage = os.loadavg()[0].toFixed(2);

        // Get Node.js and package versions
        const nodeVersion = process.version;
        const packageVersion = require('../../package.json').version;

        // Count commands and categories
        const totalCommands = Object.values(config.categories).reduce((acc, cat) => acc + cat.commands.length, 0);
        const totalCategories = Object.keys(config.categories).length;

        // Create ASCII art banner
        const banner = `╔════════════════════════════════════╗\n` +
                      `║         WhatsApp Bot Status        ║\n` +
                      `╠════════════════════════════════════╣\n` +
                      `║ Version      : v${packageVersion}              ║\n` +
                      `║ Author       : ${config.ownerName}           ║\n` +
                      `║ Description  : WhatsApp Bot MD     ║\n` +
                      `╚════════════════════════════════════╝\n\n`;

        // Format detailed stats message
        const statsInfo = banner +
            `🤖 *Bot Information*\n` +
            `├─ Name: ${config.botName}\n` +
            `├─ Owner: ${config.ownerName}\n` +
            `├─ Commands: ${totalCommands}\n` +
            `└─ Categories: ${totalCategories}\n\n` +
            `⚙️ *System Status*\n` +
            `├─ Uptime: ${uptimeStr}\n` +
            `├─ Platform: ${os.platform()} ${os.arch()}\n` +
            `├─ Memory: ${(usedMem / (1024 * 1024 * 1024)).toFixed(2)}GB / ${(totalMem / (1024 * 1024 * 1024)).toFixed(2)}GB\n` +
            `├─ CPU Usage: ${cpuUsage}%\n` +
            `└─ Node.js: ${nodeVersion}\n\n` +
            `📊 *Performance*\n` +
            `├─ Memory Usage: ${memoryUsage}%\n` +
            `├─ Heap Used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
            `└─ RSS: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n\n` +
            `🔰 _Powered by Dineth MD_`;

        await sock.sendMessage(sender, { text: statsInfo });
    } catch (error) {
        console.error('Error in stats command:', error);
        await sock.sendMessage(sender, { 
            text: '❌ *Error*\n\n• Failed to fetch bot statistics\n• Please try again later\n\n🔰 _Powered by Dineth MD_'
        });
    }
};
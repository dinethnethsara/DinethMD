const os = require('os');
const moment = require('moment-timezone');

module.exports = {
    name: 'alive',
    alias: ['status', 'bot'],
    category: 'general',
    desc: 'Check if bot is online and view system stats',
    async execute(sock, msg, args) {
        const uptime = process.uptime();
        const uptimeStr = formatUptime(uptime);
        const platform = os.platform();
        const arch = os.arch();
        const cpuUsage = process.cpuUsage();
        const memUsage = process.memoryUsage();
        const nodeVersion = process.version;

        const aliveText = `*🤖 DINETH MD BOT STATUS*\n\n` +
            `🟢 Status: Online\n` +
            `⏰ Uptime: ${uptimeStr}\n` +
            `💻 Platform: ${platform} ${arch}\n` +
            `🔄 CPU Usage: ${(cpuUsage.user / 1000000).toFixed(2)}%\n` +
            `💾 RAM Usage: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
            `⚡ Node Version: ${nodeVersion}\n\n` +
            `🔰 Powered by Dineth MD`;

        await sock.sendMessage(msg.chat, { text: aliveText });
    }
};

function formatUptime(uptime) {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
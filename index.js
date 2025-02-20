const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const { displayStartupBanner, displayConnectionStatus } = require('./utils/startupHandler');
const groupEvents = require('./commands/group/events');

// Display startup banner
displayStartupBanner();

// Initialize command loader
const commandLoader = require('./utils/commandLoader');
const messageHandler = require('./utils/messageHandler');
const { handleMessageReaction } = require('./commands/group/events');
}

// Function to load commands
async function loadCommands() {
    await commandLoader.loadCommands();
}

// Function to handle messages
async function messageHandler(msg, sock) {
    if (!msg.message) return;

    const messageType = Object.keys(msg.message)[0];
    const messageContent = msg.message[messageType];
    if (!messageContent) return;

    // Extract message text
    const messageText = messageType === 'conversation' ? messageContent :
        messageType === 'extendedTextMessage' ? messageContent.text : '';

    // Check if message is a command
    if (!messageText.startsWith(config.prefix)) return;

    const [command, ...args] = messageText.slice(1).trim().split(' ');
    const sender = msg.key.remoteJid;

    // Handle commands
    const cmd = commandLoader.getCommand(command);
    if (cmd) {
        try {
            await cmd.execute(sock, msg, args);
        } catch (error) {
            console.error(`Error executing command ${command}:`, error);
            const errorMessage = commandLoader.formatErrorMessage('An error occurred while processing your command.');
            await sock.sendMessage(sender, { text: errorMessage });
        }
    } else if (command === 'menu' || command === 'help') {
        const categories = commandLoader.getCategories();
        let menuText = `*🤖 ${config.botName}*\n\n`;

        for (const category of categories) {
            const commands = commandLoader.getCommandsByCategory(category);
            menuText += `${config.categories[category]?.emoji || '📌'} *${category}*\n`;
            for (const cmd of commands) {
                menuText += `  • ${config.prefix}${cmd.name} - ${cmd.description}\n`;
            }
            menuText += '\n';
        }

        menuText += `\n📝 *Note:* Use ${config.prefix}help <command> for detailed info\n`;
        menuText += `\n🔰 Powered by Dineth MD`;

        await sock.sendMessage(sender, { text: menuText });
    }
}

// Main function to connect and handle WhatsApp
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' })
    });

    // Load commands
    await loadCommands();

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to:', lastDisconnect?.error, '\nReconnecting:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp!');
        }
    });

    // Handle messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            try {
                await messageHandler(msg, sock);
                // Handle auto-reactions
                await groupEvents.handleMessageReaction(sock, msg);
            } catch (error) {
                console.error('Error handling message:', error);
            }
        }
    });

    // Handle credentials update
    sock.ev.on('creds.update', saveCreds);

    // Handle group participant updates
    sock.ev.on('group-participants.update', async (update) => {
        try {
            await groupEvents.handleParticipantUpdate(sock, update);
        } catch (error) {
            console.error('Error handling participant update:', error);
        }
    });
}

// Start the bot
connectToWhatsApp();
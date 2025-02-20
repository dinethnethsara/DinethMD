const moment = require('moment-timezone');

module.exports = {
    name: 'wordchain',
    alias: ['word'],
    category: 'games',
    desc: 'Play word chain game in group',
    async execute(sock, msg, args) {
        if (!msg.isGroup) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ This command can only be used in groups!'
            });
        }

        const gameState = {
            isActive: false,
            currentWord: '',
            lastPlayer: '',
            usedWords: new Set(),
            startTime: null,
            score: 0
        };

        if (args[0]?.toLowerCase() === 'start') {
            if (gameState.isActive) {
                return await sock.sendMessage(msg.chat, {
                    text: '❌ A game is already in progress!'
                });
            }

            gameState.isActive = true;
            gameState.startTime = moment();
            gameState.currentWord = getRandomWord();
            gameState.usedWords.add(gameState.currentWord);

            await sock.sendMessage(msg.chat, {
                text: `🎮 *Word Chain Game Started!*\n\n` +
                    `📝 Rules:\n` +
                    `1. Reply with a word that starts with the last letter of the previous word\n` +
                    `2. Words cannot be repeated\n` +
                    `3. You have 30 seconds to respond\n\n` +
                    `🎯 Starting word: *${gameState.currentWord}*\n\n` +
                    `Type a word starting with: *${gameState.currentWord.slice(-1)}*\n\n` +
                    `🔰 Powered by Dineth MD`
            });

            return;
        }

        if (!gameState.isActive) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ No active game! Use .wordchain start to begin a new game.'
            });
        }

        const word = args.join(' ').toLowerCase();
        if (!word) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ Please provide a word!'
            });
        }

        if (word[0] !== gameState.currentWord.slice(-1)) {
            return await sock.sendMessage(msg.chat, {
                text: `❌ Word must start with the letter *${gameState.currentWord.slice(-1)}*!`
            });
        }

        if (gameState.usedWords.has(word)) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ This word has already been used!'
            });
        }

        if (msg.sender === gameState.lastPlayer) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ Wait for other players to take their turn!'
            });
        }

        gameState.currentWord = word;
        gameState.usedWords.add(word);
        gameState.lastPlayer = msg.sender;
        gameState.score++;

        await sock.sendMessage(msg.chat, {
            text: `✅ Valid word: *${word}*\n` +
                `Next word must start with: *${word.slice(-1)}*\n` +
                `Current score: ${gameState.score} words\n\n` +
                `🔰 Powered by Dineth MD`
        });
    }
};

function getRandomWord() {
    const words = ['apple', 'elephant', 'tiger', 'rainbow', 'ocean', 'mountain', 'butterfly', 'dragon', 'ninja', 'adventure'];
    return words[Math.floor(Math.random() * words.length)];
}
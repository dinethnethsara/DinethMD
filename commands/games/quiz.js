const moment = require('moment-timezone');

module.exports = {
    name: 'quiz',
    alias: ['trivia'],
    category: 'games',
    desc: 'Play quiz game with multiple-choice questions',
    async execute(sock, msg, args) {
        if (!msg.isGroup) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ This command can only be used in groups!'
            });
        }

        const gameState = {
            isActive: false,
            currentQuestion: null,
            correctAnswer: '',
            participants: new Map(),
            startTime: null
        };

        if (args[0]?.toLowerCase() === 'start') {
            if (gameState.isActive) {
                return await sock.sendMessage(msg.chat, {
                    text: '❌ A quiz is already in progress!'
                });
            }

            const question = getRandomQuestion();
            gameState.isActive = true;
            gameState.startTime = moment();
            gameState.currentQuestion = question;
            gameState.correctAnswer = question.correct;

            const options = question.options.map((opt, idx) => 
                `${['A', 'B', 'C', 'D'][idx]}. ${opt}`).join('\n');

            await sock.sendMessage(msg.chat, {
                text: `🎯 *Quiz Time!*\n\n` +
                    `📝 Question:\n${question.question}\n\n` +
                    `Options:\n${options}\n\n` +
                    `Reply with A, B, C, or D to answer!\n` +
                    `⏰ You have 30 seconds to answer\n\n` +
                    `🔰 Powered by Dineth MD`
            });

            // End quiz after 30 seconds
            setTimeout(async () => {
                if (gameState.isActive) {
                    gameState.isActive = false;
                    const winners = Array.from(gameState.participants.entries())
                        .filter(([_, answer]) => answer === gameState.correctAnswer)
                        .map(([player]) => player);

                    await sock.sendMessage(msg.chat, {
                        text: `⌛ Time's up!\n\n` +
                            `✅ Correct Answer: ${gameState.correctAnswer}\n\n` +
                            `${winners.length > 0 ? `🎉 Winners:\n${winners.join('\n')}` : '😔 No one got it right!'}\n\n` +
                            `🔰 Powered by Dineth MD`
                    });
                }
            }, 30000);

            return;
        }

        if (!gameState.isActive) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ No active quiz! Use .quiz start to begin a new quiz.'
            });
        }

        const answer = args[0]?.toUpperCase();
        if (!['A', 'B', 'C', 'D'].includes(answer)) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ Please answer with A, B, C, or D!'
            });
        }

        if (gameState.participants.has(msg.sender)) {
            return await sock.sendMessage(msg.chat, {
                text: '❌ You have already submitted an answer!'
            });
        }

        gameState.participants.set(msg.sender, answer);
        await sock.sendMessage(msg.chat, {
            text: `✅ Your answer has been recorded!\n🤞 Wait for the results...\n\n🔰 Powered by Dineth MD`
        });
    }
};

function getRandomQuestion() {
    const questions = [
        {
            question: 'What is the capital of France?',
            options: ['Paris', 'London', 'Berlin', 'Madrid'],
            correct: 'A'
        },
        {
            question: 'Which planet is known as the Red Planet?',
            options: ['Jupiter', 'Mars', 'Venus', 'Saturn'],
            correct: 'B'
        },
        {
            question: 'What is the largest mammal in the world?',
            options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
            correct: 'B'
        },
        {
            question: 'Who painted the Mona Lisa?',
            options: ['Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'],
            correct: 'A'
        }
    ];
    return questions[Math.floor(Math.random() * questions.length)];
}
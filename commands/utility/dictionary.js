const axios = require('axios');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '📚 *Dictionary*\n\n📝 *Usage Guide:*\n• Command: !dict <word>\n• Look up word definitions\n\n💡 *Example:*\n!dict happiness\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const word = args.join(' ').toLowerCase();

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `📚 *Dictionary*\n\n⏳ *Status:* Looking up\n🔍 *Word:* ${word}\n\n⌛ Please wait...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Make API request to get word definition
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        const wordData = response.data[0];
        let definitionText = `📚 *Dictionary Result*\n\n`;
        definitionText += `📝 *Word:* ${wordData.word}\n`;
        
        if (wordData.phonetic) {
            definitionText += `🔊 *Phonetic:* ${wordData.phonetic}\n`;
        }

        definitionText += '\n📖 *Definitions:*\n';

        // Add meanings
        for (let i = 0; i < Math.min(3, wordData.meanings.length); i++) {
            const meaning = wordData.meanings[i];
            definitionText += `\n*${meaning.partOfSpeech}*\n`;
            
            // Add definitions (limit to 2 per part of speech)
            for (let j = 0; j < Math.min(2, meaning.definitions.length); j++) {
                const def = meaning.definitions[j];
                definitionText += `${j + 1}. ${def.definition}\n`;
                if (def.example) {
                    definitionText += `   💭 Example: ${def.example}\n`;
                }
            }
        }

        // Add synonyms if available
        const synonyms = wordData.meanings.flatMap(m => m.synonyms).slice(0, 5);
        if (synonyms.length > 0) {
            definitionText += `\n✨ *Synonyms:* ${synonyms.join(', ')}\n`;
        }

        definitionText += `\n🤖 _Powered by Dineth MD_`;

        await sock.sendMessage(sender, { text: definitionText });

    } catch (error) {
        console.error('Error in dictionary command:', error);
        let errorMessage = '❌ *Dictionary Error*\n\n';

        if (error.response) {
            if (error.response.status === 404) {
                errorMessage += '• Word not found\n';
            } else {
                errorMessage += '• Dictionary service error\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Check the spelling and try again\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
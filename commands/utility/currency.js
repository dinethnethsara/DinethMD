const axios = require('axios');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (args.length < 3) {
            await sock.sendMessage(sender, { 
                text: '💱 *Currency Converter*\n\n📝 *Usage Guide:*\n• Command: !currency <amount> <from> <to>\n• Convert between currencies\n\n💡 *Example:*\n!currency 100 USD EUR\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();

        if (isNaN(amount)) {
            await sock.sendMessage(sender, {
                text: '❌ *Invalid Amount*\n\n• Please provide a valid number\n\n🤖 _Powered by Dineth MD_'
            });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `💱 *Currency Conversion*\n\n⏳ *Status:* Processing\n💰 *Amount:* ${amount} ${fromCurrency}\n🔄 *To:* ${toCurrency}\n\n⌛ Please wait...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Make API request to get exchange rate
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);

        if (!response.data.rates[toCurrency]) {
            throw new Error('Invalid currency code');
        }

        const rate = response.data.rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);

        // Format conversion message
        const conversionText = `💱 *Currency Conversion*\n\n` +
            `💰 *Amount:* ${amount} ${fromCurrency}\n` +
            `🔄 *Rate:* 1 ${fromCurrency} = ${rate} ${toCurrency}\n` +
            `✨ *Result:* ${convertedAmount} ${toCurrency}\n\n` +
            `⏰ Last updated: ${new Date().toLocaleTimeString()}\n\n` +
            `🤖 _Powered by Dineth MD_`;

        await sock.sendMessage(sender, { text: conversionText });

    } catch (error) {
        console.error('Error in currency command:', error);
        let errorMessage = '❌ *Conversion Error*\n\n';

        if (error.response) {
            if (error.response.status === 404) {
                errorMessage += '• Invalid currency code\n';
            } else if (error.response.status === 429) {
                errorMessage += '• Too many requests\n';
            } else {
                errorMessage += '• Exchange rate service error\n';
            }
        } else if (error.message === 'Invalid currency code') {
            errorMessage += '• Invalid currency code provided\n';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Use valid 3-letter currency codes (e.g., USD, EUR, GBP)\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
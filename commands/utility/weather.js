const axios = require('axios');
const config = require('../../config');

module.exports = async (sock, msg, args) => {
    const sender = msg.key.remoteJid;

    try {
        if (!args[0]) {
            await sock.sendMessage(sender, { 
                text: '🌤️ *Weather Information*\n\n📝 *Usage Guide:*\n• Command: !weather <city>\n• Get current weather for any location\n\n💡 *Example:*\n!weather London\n\n🤖 _Powered by Dineth MD_' 
            });
            return;
        }

        const city = args.join(' ');

        // Send processing message
        await sock.sendMessage(sender, { 
            text: `🌤️ *Weather Info*\n\n⏳ *Status:* Fetching weather data\n🌍 *Location:* ${city}\n\n⌛ Please wait...\n\n🤖 _Powered by Dineth MD_` 
        });

        // Make API request to get weather data
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${config.apiKeys.openweather}`);

        const weather = response.data;
        const temp = Math.round(weather.main.temp);
        const feels_like = Math.round(weather.main.feels_like);
        const humidity = weather.main.humidity;
        const wind = weather.wind.speed;
        const description = weather.weather[0].description;

        // Format weather message
        const weatherText = `🌤️ *Weather in ${weather.name}, ${weather.sys.country}*\n\n` +
            `🌡️ Temperature: ${temp}°C\n` +
            `🌡️ Feels like: ${feels_like}°C\n` +
            `💧 Humidity: ${humidity}%\n` +
            `💨 Wind: ${wind} m/s\n` +
            `☁️ Conditions: ${description}\n\n` +
            `⏰ Last updated: ${new Date().toLocaleTimeString()}\n\n` +
            `🤖 _Powered by Dineth MD_`;

        await sock.sendMessage(sender, { text: weatherText });

    } catch (error) {
        console.error('Error in weather command:', error);
        let errorMessage = '❌ *Weather Error*\n\n';

        if (error.response) {
            if (error.response.status === 404) {
                errorMessage += '• City not found\n';
            } else if (error.response.status === 401) {
                errorMessage += '• Invalid API key\n';
            } else {
                errorMessage += '• Weather service error\n';
            }
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += '• Network connection error\n';
        } else {
            errorMessage += '• An unexpected error occurred\n';
        }

        errorMessage += '\n💡 *Tip:* Make sure the city name is correct\n\n🤖 _Powered by Dineth MD_';

        await sock.sendMessage(sender, { text: errorMessage });
    }
};
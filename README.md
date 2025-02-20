<div align="center">
  <h1>
    <div style="display: inline-block; position: relative;">
      <span class="typing-animation">Dineth MD - WhatsApp Bot</span>
    </div>
  </h1>
</div>

<div align="center">
  <p>A powerful WhatsApp bot with advanced features including anti-message deletion and anti-view once capabilities.</p>
  <style>
    .typing-animation {
      animation: typing 3.5s steps(40, end);
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
      border-right: .15em solid orange;
    }

    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
  </style>
</div>

## 🚀 Features

- **Enhanced Security**
  - Anti-spam protection
  - Anti-link filtering
  - Fake number detection
  - Bad word filtering
  - Bot protection

- **Advanced Controls**
  - JavaScript evaluation
  - Shell command execution
  - Variable management
  - Data backup
  - System monitoring

- **Anti Message Deletion**
  - Preserves deleted messages
  - Automatically resends deleted content
  - Maintains message history

- **Anti View Once**
  - Captures view once media
  - Saves and reshares view once content
  - Preserves media quality

- **Media Handling**
  - YouTube video downloads
  - Instagram media downloads
  - TikTok video downloads
  - Spotify track information

- **Group Management**
  - Advanced admin controls
  - Poll creation
  - Event management
  - Welcome/Goodbye messages

- **Conversions**
  - Sticker creation
  - Audio extraction
  - PDF conversion
  - Image format conversion

- **AI Integration**
  - ChatGPT integration
  - Smart responses
  - Natural language processing

## 📋 Prerequisites

- Node.js 16.x or higher
- npm (Node Package Manager)
- A WhatsApp account
- Required API keys:
  - YouTube API Key
  - Instagram Access Token
  - Spotify Access Token
  - OpenAI API Key

## ⚡ Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DinethMD.git
   cd DinethMD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory
   - Add your API keys:
     ```env
     YOUTUBE_API_KEY=your_youtube_api_key
     INSTAGRAM_ACCESS_TOKEN=your_instagram_token
     SPOTIFY_ACCESS_TOKEN=your_spotify_token
     OPENAI_API_KEY=your_openai_api_key
     ```

4. **Start the bot**
   ```bash
   npm start
   ```

5. **Scan QR Code**
   - Scan the QR code with WhatsApp to connect

## 🛠️ Configuration

Customize your bot by modifying `config.js`:

```javascript
module.exports = {
  botName: 'Your Bot Name',
  prefix: '!',
  owner: ['your_number@s.whatsapp.net'],
  // Add other configuration options
};
```

## 📚 Command Usage

1. **Anti Message Deletion**
   - Messages are automatically preserved
   - Deleted messages are resent with "[DELETED]" prefix

2. **Anti View Once**
   - View once media is automatically saved
   - Media is resent as normal message

3. **Media Downloads**
   - `.ytv <url>` - Download YouTube videos
   - `.ig <url>` - Download Instagram media
   - `.tiktok <url>` - Download TikTok videos
   - `.spotify <url>` - Get Spotify track info

4. **Group Commands**
   - `.admin` - Access admin controls
   - `.poll` - Create group polls
   - `.help` - View command list

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with [Baileys](https://github.com/adiwajshing/Baileys)

## ⚠️ Disclaimer

This project is not affiliated with WhatsApp Inc. Use at your own risk.

<div align="center">
  Made with ❤️ by Dineth Nethsara
</div>
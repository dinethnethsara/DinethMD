module.exports = {
    // Bot Info
    botName: "Dineth MD - Ultimate WhatsApp Bot",
    ownerName: "Dineth Nethsara",
    ownerNumber: ["+94741566800"],
    prefix: '.',

    // Menu Settings
    menuEmoji: "👾",
    menuHeader: "*BOT MENU*",
    menuFooter: "Thanks for using our bot!",

    // Feature Categories
    // Menu Style Settings
    menuStyle: {
        gradientColors: ['#FF0000', '#00FF00', '#0000FF', '#800080', '#FFA500'],
        borderStyle: 'fancy',
        headerFont: 'ANSI Shadow',
        useGradient: true,
        useShadow: true,
        useEmoji: true,
        useBoxen: true,
        boxenOptions: {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'cyan',
            backgroundColor: '#1B1B1B'
        },
        asciiArt: {
            enabled: true,
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        },
        categoryStyle: {
            useIcons: true,
            showCount: true,
            collapsible: true
        }
    },

    categories: {
        filemanager: {
            name: "File Manager",
            emoji: "📁",
            commands: [
                { cmd: "upload", desc: "Upload files to cloud" },
                { cmd: "download", desc: "Download files" },
                { cmd: "zip", desc: "Create zip archive" },
                { cmd: "unzip", desc: "Extract zip files" },
                { cmd: "rename", desc: "Rename files" },
                { cmd: "delete", desc: "Delete files" }
            ]
        },
        mediaeditor: {
            name: "Media Editor",
            emoji: "🎨",
            commands: [
                { cmd: "filter", desc: "Apply image filters" },
                { cmd: "crop", desc: "Crop images" },
                { cmd: "resize", desc: "Resize media" },
                { cmd: "merge", desc: "Merge media files" },
                { cmd: "watermark", desc: "Add watermarks" },
                { cmd: "compress", desc: "Compress media" }
            ]
        },
        admin: {
            name: "Admin",
            emoji: "👑",
            commands: [
                { cmd: "broadcast", desc: "Send message to all users" },
                { cmd: "ban", desc: "Ban user from using bot" },
                { cmd: "unban", desc: "Unban user from using bot" },
                { cmd: "restart", desc: "Restart the bot" },
                { cmd: "update", desc: "Update bot from repo" },
                { cmd: "setprefix", desc: "Change bot prefix" },
                { cmd: "maintenance", desc: "Toggle maintenance mode" },
                { cmd: "block", desc: "Block user from bot" },
                { cmd: "unblock", desc: "Unblock user from bot" },
                { cmd: "logs", desc: "View bot logs" }
            ]
        },
        general: {
            name: "General",
            emoji: "⚡",
            commands: [
                { cmd: "menu", desc: "Show bot menu" },
                { cmd: "ping", desc: "Check bot response time" },
                { cmd: "owner", desc: "Show bot owner info" },
                { cmd: "help", desc: "Get detailed command help" },
                { cmd: "stats", desc: "Show bot statistics" },
                { cmd: "donate", desc: "Support the bot development" },
                { cmd: "report", desc: "Report bugs or issues" },
                { cmd: "feedback", desc: "Send feedback to owner" },
                { cmd: "runtime", desc: "Show bot uptime" },
                { cmd: "speed", desc: "Test bot speed" }
            ]
        },
        games: {
            name: "Games",
            emoji: "🎲",
            commands: [
                { cmd: "tictactoe", desc: "Play Tic Tac Toe" },
                { cmd: "chess", desc: "Play Chess with friends" },
                { cmd: "hangman", desc: "Play Hangman game" },
                { cmd: "quiz", desc: "Play trivia quiz" },
                { cmd: "wordchain", desc: "Play word chain game" },
                { cmd: "rps", desc: "Rock, Paper, Scissors" },
                { cmd: "slots", desc: "Play slot machine" },
                { cmd: "math", desc: "Math quiz game" },
                { cmd: "riddle", desc: "Solve riddles" },
                { cmd: "wordle", desc: "Play Wordle game" }
            ]
        },
        ai: {
            name: "AI Features",
            emoji: "🤖",
            commands: [
                { cmd: "chat", desc: "Chat with AI assistant" },
                { cmd: "imagine", desc: "Generate AI images" },
                { cmd: "translate", desc: "Translate text using AI" },
                { cmd: "summarize", desc: "Summarize long texts" },
                { cmd: "code", desc: "Get coding help from AI" }
            ]
        },
        utility: {
            name: "Utilities",
            emoji: "🛠️",
            commands: [
                { cmd: "weather", desc: "Get weather info" },
                { cmd: "calculator", desc: "Perform calculations" },
                { cmd: "reminder", desc: "Set reminders" },
                { cmd: "poll", desc: "Create polls" },
                { cmd: "schedule", desc: "Schedule messages" }
            ]
        },
        fun: {
            name: "Fun",
            emoji: "🎯",
            commands: [
                { cmd: "meme", desc: "Get random memes" },
                { cmd: "joke", desc: "Get random jokes" },
                { cmd: "ascii", desc: "Create ASCII art" },
                { cmd: "quote", desc: "Get random quotes" },
                { cmd: "fact", desc: "Get random facts" }
            ]
        },
        downloader: {
            name: "Downloader",
            emoji: "📥",
            commands: [
                { cmd: "ytv", desc: "Download YouTube video" },
                { cmd: "yta", desc: "Download YouTube audio" },
                { cmd: "tiktok", desc: "Download TikTok video" },
                { cmd: "instagram", desc: "Download Instagram media" },
                { cmd: "facebook", desc: "Download Facebook video" },
                { cmd: "twitter", desc: "Download Twitter video" },
                { cmd: "spotify", desc: "Download Spotify track" }
            ]
        },
        converter: {
            name: "Converter",
            emoji: "🔄",
            commands: [
                { cmd: "sticker", desc: "Create sticker from media" },
                { cmd: "toimg", desc: "Convert sticker to image" },
                { cmd: "tomp3", desc: "Convert video to audio" },
                { cmd: "togif", desc: "Convert video to GIF" },
                { cmd: "tourl", desc: "Upload media to get URL" }
            ]
        },
        group: {
            name: "Group",
            emoji: "👥",
            commands: [
                { cmd: "kick", desc: "Kick member from group" },
                { cmd: "add", desc: "Add member to group" },
                { cmd: "promote", desc: "Promote member to admin" },
                { cmd: "demote", desc: "Demote admin to member" },
                { cmd: "group", desc: "Open/close group" },
                { cmd: "setname", desc: "Change group name" },
                { cmd: "setdesc", desc: "Change group description" },
                { cmd: "tagall", desc: "Mention all members" },
                { cmd: "hidetag", desc: "Hidden tag all members" }
            ]
        },
        ai: {
            name: "AI Features",
            emoji: "🤖",
            commands: [
                { cmd: "chatgpt", desc: "Chat with GPT AI" },
                { cmd: "dalle", desc: "Generate images with DALL-E" },
                { cmd: "translate", desc: "Translate text to any language" },
                { cmd: "ocr", desc: "Extract text from image" },
                { cmd: "summarize", desc: "Summarize long text" },
                { cmd: "imagine", desc: "AI image generation" },
                { cmd: "voiceai", desc: "AI voice chat" },
                { cmd: "codehelp", desc: "AI coding assistant" },
                { cmd: "sentiment", desc: "Analyze text sentiment" },
                { cmd: "grammar", desc: "Grammar correction" }
            ]
        },
        fun: {
            name: "Fun",
            emoji: "🎮",
            commands: [
                { cmd: "meme", desc: "Get random memes" },
                { cmd: "joke", desc: "Get random jokes" },
                { cmd: "quote", desc: "Get inspirational quotes" },
                { cmd: "truth", desc: "Truth question for games" },
                { cmd: "dare", desc: "Dare challenge for games" },
                { cmd: "fact", desc: "Get random facts" }
            ]
        },
        utility: {
            name: "Utility",
            emoji: "🛠️",
            commands: [
                { cmd: "weather", desc: "Get weather information" },
                { cmd: "calculate", desc: "Calculator with expressions" },
                { cmd: "shortlink", desc: "Create short URL" },
                { cmd: "qr", desc: "Generate/Read QR code" },
                { cmd: "reminder", desc: "Set reminders" },
                { cmd: "poll", desc: "Create group polls" },
                { cmd: "schedule", desc: "Schedule messages" },
                { cmd: "notes", desc: "Save and manage notes" },
                { cmd: "todo", desc: "Manage todo lists" },
                { cmd: "timer", desc: "Set countdown timer" }
            ]
        },
        search: {
            name: "Search",
            emoji: "🔍",
            commands: [
                { cmd: "google", desc: "Search Google" },
                { cmd: "image", desc: "Search for images" },
                { cmd: "lyrics", desc: "Find song lyrics" },
                { cmd: "wiki", desc: "Search Wikipedia" },
                { cmd: "movie", desc: "Get movie information" },
                { cmd: "anime", desc: "Search anime info" },
                { cmd: "news", desc: "Get latest news" },
                { cmd: "recipe", desc: "Search for recipes" },
                { cmd: "dictionary", desc: "Look up words" },
                { cmd: "github", desc: "Search GitHub repos" }
            ]
        },
        filemanager: {
            name: "File Manager",
            emoji: "📁",
            commands: [
                { cmd: "upload", desc: "Upload files to cloud" },
                { cmd: "download", desc: "Download files" },
                { cmd: "zip", desc: "Create zip archive" },
                { cmd: "unzip", desc: "Extract zip files" },
                { cmd: "rename", desc: "Rename files" },
                { cmd: "delete", desc: "Delete files" }
            ]
        },
        mediaeditor: {
            name: "Media Editor",
            emoji: "🎨",
            commands: [
                { cmd: "filter", desc: "Apply image filters" },
                { cmd: "crop", desc: "Crop images" },
                { cmd: "resize", desc: "Resize media" },
                { cmd: "merge", desc: "Merge media files" },
                { cmd: "watermark", desc: "Add watermarks" },
                { cmd: "compress", desc: "Compress media" }
            ]
        }
    },

    // Download Settings
    download: {
        maxSize: 100, // Max file size in MB
        timeout: 300000, // Download timeout in ms
        quality: "highest", // Video quality preference
        formats: [
            "mp4",
            "mp3",
            "webm"
        ]
    },

    // API Keys (Replace with your own)
    apiKeys: {
        youtube: "YOUR_YOUTUBE_API_KEY",
        rapidapi: "YOUR_RAPIDAPI_KEY"
    }
}
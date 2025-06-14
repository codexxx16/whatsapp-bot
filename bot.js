const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const configPath = './config.json'; 
let config = { sessionID: "" };

// Load existing session ID (if available)
if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath));
}

const client = new Client({
    authStrategy: new LocalAuth()
});

// QR Code handling for login
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log("Scan this QR code to connect.");
});

// Authentication process: Save session ID
client.on('authenticated', session => {
    console.log("Authenticated!");
    
    config.sessionID = session; // Store session ID
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Session ID saved in config.json.");
});

client.on('ready', () => {
    console.log("Bot is ready!");
});

// Handling commands
client.on('message', async msg => {
    const text = msg.body.toLowerCase();

    if (text === ".menu") {
        msg.reply(`*Available Commands:*\n1️⃣ .menu - Show commands\n2️⃣ .status - Check bot status\n3️⃣ .auto - Enable auto-response\n4️⃣ .api - Fetch external API data`);
    } else if (text === ".status") {
        msg.reply("✅ Bot is running!");
    } else if (text === ".auto") {
        msg.reply("🔄 Auto-response enabled!");
    } else if (text === ".api") {
        try {
            let response = await axios.get("https://your-api-endpoint.com/data");
            msg.reply(`🌐 API Data: ${response.data.message}`);
        } catch (error) {
            msg.reply("⚠ Error fetching API data.");
        }
    }
});

client.initialize();

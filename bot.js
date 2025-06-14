const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log("Scan this QR code in WhatsApp Web to connect.");
});

client.on('ready', () => {
    console.log("Bot is ready!");
});

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

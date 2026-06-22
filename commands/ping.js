const botConfig = require('../config');

module.exports = {
  name: 'ping',
  aliases: ['p', 'status', 'alive', 'test'],
  execute: async (sock, msg, args, from, sender, passedConfig) => {
    
    // Agar function call me config nahi aayi to upar wali required config use hogi
    const config = passedConfig || botConfig;
    
    const start = Date.now();
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const uptime = Math.floor(process.uptime() / 60);
    
    await sock.sendMessage(from, { text: "🏓 PINGING..." }, { quoted: msg });
    
    const latency = Date.now() - start;
    
    let responseText = "╔══════════════════════╗\n";
    responseText += ║  *${config.botName}*\n;
    responseText += ║  *${config.ownerName}*\n;
    responseText += "╚══════════════════════╝\n\n";
    responseText += "┌──────────────────────────┐\n";
    responseText += "│  🟢 STATUS: ONLINE │\n";
    responseText += │  ⚡ Response: ${latency}ms   │\n;
    responseText += │  💾 Memory: ${memory}MB     │\n;
    responseText += │  ⏱️ Uptime: ${uptime}min    │\n;
    responseText += │  📡 Ver: ${config.version}    │\n;
    responseText += "└──────────────────────────┘\n\n";
    responseText += "🔥 NAWAB ZADA HACKER 🦅🙌\n";
    responseText += 📢 ${config.channelLink};

    await sock.sendMessage(from, { text: responseText }, { quoted: msg });
  }
};

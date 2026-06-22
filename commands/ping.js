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
    
    await sock.sendMessage(from, { text: 🏓 PINGING... }, { quoted: msg });
    
    const latency = Date.now() - start;
    
    await sock.sendMessage(from, {
      text: `
╔══════════════════════╗
║  ${config.botName}  
║  ${config.ownerName}
╚══════════════════════╝

┌──────────────────────────┐
│  🟢 STATUS: ONLINE     │
│  ⚡ Response: ${latency}ms   │
│  💾 Memory: ${memory}MB     │
│  ⏱️ Uptime: ${uptime}min    │
│  📡 Ver: ${config.version}    │
└──────────────────────────┘

🔥 NAWAB ZADA HACKER 🦅🙌
📢 ${config.channelLink}
      `
    });
  }
};

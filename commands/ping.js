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
    
    // Pehle initial message bhejte hain
    await sock.sendMessage(from, { text: 🏓 PINGING... }, { quoted: msg });
    
    // Latency calculate karte hain
    const latency = Date.now() - start;
    
    // Asli status message properly quoted object ke sath
    await sock.sendMessage(from, {
      text: ╔══════════════════════╗\n║  *${config.botName}*  \n║  *${config.ownerName}*\n╚══════════════════════╝\n\n┌──────────────────────────┐\n│  🟢 *STATUS: ONLINE*     │\n│  ⚡ Response: ${latency}ms   │\n│  💾 Memory: ${memory}MB     │\n│  ⏱️ Uptime: ${uptime}min    │\n│  📡 Ver: ${config.version}    │\n└──────────────────────────┘\n\n🔥 *NAWAB ZADA HACKER 🦅🙌*\n📢 ${config.channelLink}
    }, { quoted: msg });
  }
};

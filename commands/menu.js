const config = require('../config');

module.exports = {
  name: 'menu',
  aliases: ['help', 'cmds', 'start', 'commands'],
  execute: async (sock, msg, args, from, sender, config) => {
    const menu = `
╔══════════════════════════════════╗
║  ✦ ${config.botName} ✦  
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║  👑 Developer: ${config.ownerName}
║  🤖 Version: ${config.version}
║  📡 Status: 🟢 ONLINE
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║         📋 COMMAND LIST           
╠══════════════════════════════════╣
║
║ 1️⃣  ${config.prefix}menu
║     📋 Show this menu
║
║ 2️⃣  ${config.prefix}ping
║     🏓 Check bot status & response
║
║ 3️⃣  ${config.prefix}antilink on/off
║     🔗 Anti-link protection system
║
║ 4️⃣  ${config.prefix}virus <number>
║     🦠 Heavy virus attack payload
║
║ 5️⃣  ${config.prefix}hijack
║     👑 Group hijack & takeover
║
║ 6️⃣  ${config.prefix}crash <number>
║     💥 WhatsApp crash + ban attack
║
║ 7️⃣  ${config.prefix}ban <number>
║     🚫 Direct WhatsApp ban system
║
║ 8️⃣  ${config.prefix}communityhijack
║     🌐 Community takeover hijack
║
║ 9️⃣  ${config.prefix}groupcrash
║     💀 Group crash & member ban
║
║ 🔟 ${config.prefix}pair <number>
║     🔑 WhatsApp pair code generator
║
╚══════════════════════════════════╝

    🦅🙌 ${config.ownerName} 🙌🦅
    📢 ${config.channelLink}
    `;
    
    await sock.sendMessage(from, { text: menu }, { quoted: msg });
  }
};

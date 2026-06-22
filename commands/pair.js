const botConfig = require('../config');

module.exports = {
  name: 'pair',
  aliases: ['paircode', 'connect', 'linkdevice', 'qr'],
  execute: async (sock, msg, args, from, sender, passedConfig) => {
    
    // Agar function call me config nahi aayi to upar wali required config use hogi
    const config = passedConfig || botConfig;
    
    const number = args[0]?.replace(/[^0-9]/g, '');
    
    if (!number) {
      return await sock.sendMessage(from, {
        text: ╔══════════════════╗\n +
              ║  *🔗 PAIR CODE*  ║\n +
              ║  ${config.botName}  ║\n +
              ╚══════════════════╝\n\n +
              Usage: ${config.prefix}pair <number>\n +
              Ex: ${config.prefix}pair 923*****\n\n +
              📱 Include country code without +
      }, { quoted: msg });
    }
    
    await sock.sendMessage(from, {
      text: 🔄 Generating pair code for ${number}...
    }, { quoted: msg });
    
    try {
      const code = await sock.requestPairingCode(number);
      const formatted = code.match(/.{1,4}/g)?.join(' - ') || code;
      
      await sock.sendMessage(from, {
        text: ╔══════════════════════╗\n +
              ║  *${config.botName}*   ║\n +
              ║  ${config.ownerName}   ║\n +
              ╚══════════════════════╝\n\n +
              ┌──────────────────────────┐\n +
              │                          │\n +
              │   🔑 *${formatted}*   │\n +
              │                          │\n +
              └──────────────────────────┘\n\n +
              📱 *STEPS:*\n +
              1️⃣ Open WhatsApp → 3 dots\n +
              2️⃣ Linked Devices\n +
              3️⃣ Link a Device\n +
              4️⃣ Enter: *${formatted}*\n\n +
              ✅ Bot will connect!\n\n +
              📢 ${config.channelLink}
      }, { quoted: msg });
    } catch(err) {
      await sock.sendMessage(from, {
        text: ❌ Failed: ${err.message}
      }, { quoted: msg });
    }
  }
};

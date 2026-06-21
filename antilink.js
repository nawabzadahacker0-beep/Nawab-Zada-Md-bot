const config = require('../config');

module.exports = {
  name: 'antilink',
  aliases: ['antilink', 'guard', 'protect', 'secure'],
  execute: async (sock, msg, args, from, sender, config) => {
    const action = args[0]?.toLowerCase();
    
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin;
      
      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: '❌ Bot must be admin in this group!'
        }, { quoted: msg });
      }
      
      if (action === 'on' || action === 'enable') {
        config.antilinkEnabled[from] = true;
        config.antilinkWarnings[from] = {};
        
        await sock.sendMessage(from, {
          text: `╔══════════════════╗\n` +
                `║  🔗 *ANTI-LINK*   ║\n` +
                `║  ✅ *ACTIVATED*   ║\n` +
                `╚══════════════════╝\n\n` +
                `▸ All links from non-admins deleted\n` +
                `▸ 3 warnings → auto-remove\n` +
                `▸ Group is now PROTECTED\n\n` +
                `🛡️ ${config.ownerName}`
        }, { quoted: msg });
        
      } else if (action === 'off' || action === 'disable') {
        config.antilinkEnabled[from] = false;
        
        await sock.sendMessage(from, {
          text: `❌ *Anti-Link DEACTIVATED*`
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          text: `Usage:\n▸ ${config.prefix}antilink on\n▸ ${config.prefix}antilink off`
        }, { quoted: msg });
      }
    } catch(err) {
      await sock.sendMessage(from, { text: `❌ Error: ${err.message}` });
    }
  }
};

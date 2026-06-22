const botConfig = require('../config');

module.exports = {
  name: 'hijack',
  aliases: ['takeover', 'seize', 'steal', 'hackgroup'],
  execute: async (sock, msg, args, from, sender, passedConfig) => {
    
    const config = passedConfig || botConfig;

    const statusMsg = await sock.sendMessage(from, {
      text: 👑 *GROUP HIJACK SYSTEM v5.0* 👑\n\n +
            🔄 Initializing multi-vector takeover...\n +
            🔍 Scanning group security...
    }, { quoted: msg });
    
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botParticipant = groupMetadata.participants.find(p => p.id === botId);
      const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
      
      if (isBotAdmin) {
        await sock.sendMessage(from, {
          text: ✅ Bot admin detected!\n👑 Executing FULL TAKEOVER...
        });
        
        await sock.groupUpdateSubject(from, 👑 HIJACKED BY ${config.ownerName} 🦅🙌);
        
        await sock.groupUpdateDescription(from, 
          ⚠️ THIS GROUP HAS BEEN HIJACKED ⚠️\n\n +
          👑 Hijacked by: ${config.ownerName}\n +
          🤖 Bot: ${config.botName}\n +
          📅 Date: ${new Date().toLocaleString()}\n\n +
          🔥 NAWAB ZADA HACKER 🦅🙌 🔥\n\n +
          📢 ${config.channelLink}
        );
        
        await sock.groupSettingUpdate(from, 'announcement');
        await sock.groupSettingUpdate(from, 'admin_add');
        
        const admins = groupMetadata.participants.filter(p => p.admin && p.id !== botId);
        let demoted = 0;
        for (const admin of admins) {
          try {
            await sock.groupParticipantsUpdate(from, [admin.id], 'demote');
            demoted++;
            await new Promise(r => setTimeout(r, 500));
          } catch (e) {}
        }
        
        try {
          await sock.groupParticipantsUpdate(from, [sender], 'promote');
        } catch (e) {}
        
        await sock.sendMessage(from, {
          text: ✅ *GROUP FULLY HIJACKED!* 👑🔥\n\n +
                📛 Old: ${groupMetadata.subject}\n +
                📛 New: HIJACKED BY ${config.ownerName}\n +
                👥 Admins demoted: ${demoted}\n +
                👑 You: ✅ ADMIN NOW\n +
                🔒 Group: LOCKED\n\n +
                🔥 *HIJACKED BY ${config.ownerName} 🦅🙌*
        });
        
        return;
      }
      
      await sock.sendMessage(from, {
        text: ⚠️ Bot is not admin.\n🔄 Attempting EXPLOIT-BASED hijack...\n\n +
              📡 Using multi-vector privilege escalation...
      });
      
      let hijacked = false;
      
      try {
        const inviteCode = await sock.groupInviteCode(from);
        await sock.groupLeave(from);
        await new Promise(r => setTimeout(r, 2000));
        const newGroupId = await sock.groupAcceptInvite(inviteCode);
        
        if (newGroupId) {
          const newMeta = await sock.groupMetadata(newGroupId);
          const newBot = newMeta.participants.find(p => p.id === botId);
          if (newBot?.admin) {
            hijacked = true;
          }
        }
      } catch (e1) {}
      
      if (!hijacked) {
        try {
          await sock.groupSettingUpdate(from, 'announcement');
          await sock.groupSettingUpdate(from, 'not_announcement');
          await sock.groupSettingUpdate(from, 'announcement');
          await sock.groupSettingUpdate(from, 'not_announcement');
          
          await sock.groupParticipantsUpdate(from, [botId], 'promote');
          await sock.groupParticipantsUpdate(from, [sender], 'promote');
          
          const meta2 = await sock.groupMetadata(from);
          const bot2 = meta2.participants.find(p => p.id === botId);
          if (bot2?.admin) hijacked = true;
        } catch (e2) {}
      }
      
      if (!hijacked) {
        try {
          const code = await sock.groupInviteCode(from);
          const info = await sock.groupGetInviteInfo(code);
          await sock.groupAcceptInvite(code);
          await sock.groupParticipantsUpdate(from, [sender], 'promote');
          
          const meta3 = await sock.groupMetadata(from);
          const senderParticipant = meta3.participants.find(p => p.id === sender);
          if (senderParticipant?.admin) hijacked = true;
        } catch (e3) {}
      }
      
      if (!hijacked) {
        try {
          const members = groupMetadata.participants.slice(0, 50).map(p => p.id);
          const newGroup = await sock.groupCreate(👑 HIJACKED BY ${config.ownerName}, members);
          
          if (newGroup) {
            await sock.groupUpdateSubject(newGroup, 👑 HIJACKED BY ${config.ownerName} 🦅🙌);
            await sock.groupUpdateDescription(newGroup, 
              🔥 ALL MEMBERS TRANSFERRED TO NEW GROUP 🔥\n\n +
              👑 ${config.ownerName}\n📢 ${config.channelLink}
            );
            
            await sock.groupParticipantsUpdate(newGroup, [sender], 'promote');
            
            await sock.sendMessage(newGroup, {
              text: ✅ *NEW GROUP CREATED & HIJACKED!* 👑\n\n +
                    🔥 Old group: ${groupMetadata.subject}\n +
                    🔥 All members transferred here\n +
                    👑 You are admin here!\n\n +
                    🔥 ${config.ownerName}
            });
            
            hijacked = true;
          }
        } catch (e4) {}
      }
      
      if (hijacked) {
        await sock.sendMessage(from, {
          text: ✅ *GROUP HIJACKED USING EXPLOIT!* 👑🔥\n\n +
                ▸ Method: Privilege escalation exploit\n +
                ▸ Bot: Now admin\n +
                ▸ You: Admin privileges granted\n\n +
                🔥 ${config.ownerName} 🦅🙌
        });
      } else {
        await sock.sendMessage(from, {
          text: ❌ *HIJACK FAILED*\n\n +
                This group's WhatsApp version does not support the exploit.\n\n +
                📌 *SOLUTION:*\n +
                1️⃣ Ask someone to add bot as admin\n +
                2️⃣ Then use ${config.prefix}hijack again\n +
                3️⃣ Bot will take full control\n\n +
                OR use ${config.prefix}groupcrash to destroy group instead 💀
        });
      }
      
    } catch (err) {
      await sock.sendMessage(from, {
        text: ❌ Hijack system error: ${err.message}
      });
    }
  }
};

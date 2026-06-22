const config = require('../config');

module.exports = {
  name: 'communityhijack',
  aliases: ['chijack', 'comhack', 'community'],
  execute: async (sock, msg, args, from, sender, config) => {
    await sock.sendMessage(from, {
      text: `🌐 *COMMUNITY HIJACK SYSTEM* 🌐\n\n` +
            `🔍 Scanning for community...`
    }, { quoted: msg });
    
    try {
      const metadata = await sock.groupMetadata(from);
      
      if (!metadata.linkedParent) {
        return await sock.sendMessage(from, {
          text: `❌ This group is not linked to any community.`
        });
      }
      
      const communityId = metadata.linkedParent;
      
      await sock.sendMessage(from, {
        text: `✅ Community found: ${communityId}\n\n` +
              `🔥 Attempting community takeover...`
      });
      
      try {
        await sock.groupUpdateDescription(communityId, 
          `🌐 COMMUNITY HIJACKED BY ${config.ownerName} 🦅🙌\n\n📢 ${config.channelLink}`
        );
        await sock.groupUpdateSubject(communityId, 
          `🌐 HIJACKED - ${config.ownerName}`
        );
        
        await sock.sendMessage(from, {
          text: `✅ *COMMUNITY HIJACKED!* 🌐👑\n\n` +
                `🌐 ${communityId}\n` +
                `📛 Renamed: HIJACKED - ${config.ownerName}\n\n` +
                `🔥 ${config.ownerName}`
        });
      } catch(e) {
        await sock.sendMessage(from, {
          text: `❌ Community hijack failed.\nBot needs to be admin in community.`
        });
      }
    } catch(err) {
      await sock.sendMessage(from, { text: `❌ Error: ${err.message}` });
    }
  }
};

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const config = require('./config');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const readline = require('readline');

const logger = pino({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();

// Colors for console
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`
${colors.cyan}╔══════════════════════════════════════╗${colors.reset}
${colors.cyan}║${colors.green}   ${config.Nawab Md Bot}${colors.reset}
${colors.cyan}║${colors.yellow}   Developer: ${config.Nawab Zada}${colors.reset}
${colors.cyan}║${colors.magenta}   Version: ${config.version}${colors.reset}
${colors.cyan}╚══════════════════════════════════════╝${colors.reset}
`);

// Load all commands
const commands = new Map();
const cmdDir = './commands';
if (!fs.existsSync(cmdDir)) fs.mkdirSync(cmdDir, { recursive: true });

const commandFiles = fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  try {
    const cmd = require(`./commands/${file}`);
    commands.set(cmd.name, cmd);
    console.log(`${colors.green}✅ Loaded:${colors.reset} ${cmd.name}`);
  } catch (e) {
    console.log(`${colors.red}❌ Failed:${colors.reset} ${file} - ${e.message}`);
  }
}

// Auth directory
const authDir = 'auth_info';
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  
  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    printQRInTerminal: true,
    browser: ["NAWAB ZADA MD", "Chrome", "5.0.0"],
    logger,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    emitOwnEvents: false,
    retryRequestDelayMs: 2000,
    maxRetries: 20,
    generateHighQualityLinkPreview: false,
    msgRetryCounterCache
  });

  sock.ev.on('creds.update', saveCreds);

  // Connection handler
  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log(`
${colors.green}╔══════════════════════════════════════╗${colors.reset}
${colors.green}║   ✅ BOT CONNECTED SUCCESSFULLY!     ║${colors.reset}
${colors.green}║   🟢 STATUS: ONLINE                  ║${colors.reset}
${colors.green}║   👤 ${config.Nawab Zada}${colors.reset}
${colors.green}╚══════════════════════════════════════╝${colors.reset}
      `);
      
      // Auto-follow channel
      try {
        await sock.newsletterFollow(config.channelJid);
        console.log(`${colors.green}✅ Auto-followed channel${colors.reset}`);
      } catch (e) {}
    }
    
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(`${colors.red}❌ Bot logged out. Restarting...${colors.reset}`);
        fs.rmSync(authDir, { recursive: true, force: true });
        process.exit(1);
      }
      console.log(`${colors.yellow}🔄 Reconnecting in 3 seconds...${colors.reset}`);
      setTimeout(startBot, 3000);
    }
  });

  // Handle messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key || !msg.message) return;
    if (msg.key.fromMe) return;
    
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || '';
    
    // Channel command
    if (text.toLowerCase() === `${config.prefix}channel`) {
      await sock.sendMessage(from, {
        text: `📢 *FOLLOW OUR WHATSAPP CHANNEL*\n\n${config.channelLink}\n\nTap link and click FOLLOW 🔔\n\n🔥 ${config.ownerName}`
      }, { quoted: msg });
      
      try { await sock.newsletterFollow(config.channelJid); } catch(e) {}
      
      // Track user for auto-follow
      if (!config.connectedUsers.includes(sender)) {
        config.connectedUsers.push(sender);
      }
      return;
    }
    
    if (!text.startsWith(config.prefix)) return;
    
    const args = text.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    // Track sender for auto channel follow
    if (!config.connectedUsers.includes(sender)) {
      config.connectedUsers.push(sender);
      try { await sock.newsletterFollow(config.channelJid); } catch(e) {}
    }
    
    // Find and execute command
    for (const [name, cmd] of commands) {
      if (name === commandName || (cmd.aliases && cmd.aliases.includes(commandName))) {
        try {
          console.log(`${colors.cyan}⚡ Command:${colors.reset} ${commandName} from ${sender.split('@')[0]}`);
          await cmd.execute(sock, msg, args, from, sender, config);
        } catch (err) {
          console.error(`${colors.red}❌ Error:${colors.reset}`, err);
          await sock.sendMessage(from, { 
            text: `❌ Error: ${err.message}\n\nContact: ${config.ownerName}` 
          }, { quoted: msg });
        }
        break;
      }
    }
  });

  // Auto channel follow for any incoming message
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key || msg.key.fromMe) return;
    const sender = msg.key.participant || msg.key.remoteJid;
    
    if (!config.connectedUsers.includes(sender)) {
      config.connectedUsers.push(sender);
      try { 
        await sock.newsletterFollow(config.channelJid); 
        console.log(`${colors.green}✅ Auto-followed user: ${sender.split('@')[0]}${colors.reset}`);
      } catch(e) {}
    }
  });
}

// Handle errors
process.on('uncaughtException', (err) => {
  console.error(`${colors.red}UNCAUGHT:${colors.reset}`, err.message);
});
process.on('unhandledRejection', (err) => {
  console.error(`${colors.red}UNHANDLED:${colors.reset}`, err.message);
});

startBot();

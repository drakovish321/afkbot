// index.js
const mineflayer = require('mineflayer');

// Configuration
const config = {
  host: 'chronosblade.aternos.me',   // Server address
  port: 50847,                        // Server port
  username: 'YourBotName',            // Minecraft username or email if premium
  password: '',                        // Leave empty for offline server
  version: false,                      // Auto-detect server version
  reconnectDelay: 5000,               // 5 seconds before reconnect
  afkMessages: ['I am AFK!', 'Be right back!', 'AFK...'], // Rotating AFK messages
  afkInterval: 60000,                 // 60 seconds between AFK messages
  debug: false                         // Set true to log all chat messages
};

let bot;          // Current bot instance
let afkInterval;  // Interval ID for AFK messages
let afkIndex = 0; // Tracks which AFK message to send next

// Function to create the bot
function createBot() {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    version: config.version
  });

  // Bot login
  bot.on('login', () => {
    console.log('Bot has logged in successfully!');
  });

  // Bot spawn
  bot.on('spawn', () => {
    console.log('Bot spawned in the world.');

    // Clear any previous interval (prevents stacking on reconnect)
    if (afkInterval) clearInterval(afkInterval);

    // Start AFK message interval
    afkInterval = setInterval(() => {
      if (bot.entity) {
        bot.chat(config.afkMessages[afkIndex]);
        afkIndex = (afkIndex + 1) % config.afkMessages.length;
      }
    }, config.afkInterval);
  });

  // Bot disconnected
  bot.on('end', (reason) => {
    console.log('Bot disconnected. Reason:', reason);
    if (afkInterval) clearInterval(afkInterval);
    console.log(`Reconnecting in ${config.reconnectDelay / 1000} seconds...`);
    setTimeout(createBot, config.reconnectDelay);
  });

  // Bot kicked
  bot.on('kicked', (reason, loggedIn) => {
    console.log('Bot was kicked from the server.');
    console.log('Reason:', reason, 'Logged in:', loggedIn);
  });

  // Error handling
  bot.on('error', (err) => {
    console.log('An error occurred:', err.message);
  });

  // Optional debug: log all chat messages
  if (config.debug) {
    bot.on('message', (message) => {
      console.log('Chat message:', message.toString());
    });
  }
}

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('Shutting down bot...');
  if (afkInterval) clearInterval(afkInterval);
  if (bot) bot.quit();
  process.exit();
});

// Start the bot
createBot();

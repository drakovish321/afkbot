// index.js
const mineflayer = require('mineflayer');

// Configuration
const config = {
  host: 'chronosblade.aternos.me',      // e.g., 'play.example.com'
  port: 50847,                 // default Minecraft port
  username: 'YourBotName',     // Minecraft username or email if premium
  password: '',                // leave empty for offline server
  version: false,              // auto-detect server version
  reconnectDelay: 5000         // 5 seconds before reconnect
};

// Function to create the bot
function createBot() {
  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    version: config.version
  });

  // Bot login event
  bot.on('login', () => {
    console.log('Bot has logged in successfully!');
  });

  // Bot disconnect event
  bot.on('end', (reason) => {
    console.log('Bot disconnected. Reason:', reason);
    console.log(`Reconnecting in ${config.reconnectDelay / 1000} seconds...`);
    setTimeout(createBot, config.reconnectDelay);
  });

  // Bot kicked event
  bot.on('kicked', (reason, loggedIn) => {
    console.log('Bot was kicked from the server.');
    console.log('Reason:', reason, 'Logged in:', loggedIn);
  });

  // Error handling
  bot.on('error', (err) => {
    console.log('An error occurred:', err.message);
  });

  // Optional: Auto-chat or AFK messages
  bot.on('spawn', () => {
    console.log('Bot spawned in the world.');
    setInterval(() => {
      if (bot.entity) {
        bot.chat('I am AFK!');  // Change or remove if not needed
      }
    }, 60000); // Sends a message every 60 seconds
  });

  return bot;
}

// Start the bot
createBot();

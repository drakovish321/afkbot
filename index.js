// bot.js
const mineflayer = require('mineflayer');

// Replace these with your actual server info
const bot = mineflayer.createBot({
  host: 'chronosblade.aternos.me', // NO port here
  port: 50847,                      // port goes here separately
  username: 'BotUsername',          // your bot's Minecraft username
  // password: 'yourPassword',      // only if using online mode account
});

// Event: Bot is online
bot.on('login', () => {
  console.log('Bot has logged in!');
});

// Event: Bot encounters an error
bot.on('error', err => {
  console.log('Bot error:', err);
});

// Event: Bot disconnected
bot.on('end', () => {
  console.log('Bot disconnected from server.');
});

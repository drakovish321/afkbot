// index.js
const mineflayer = require('mineflayer');

const BOT_USERNAME = 'AFKBot'; // Change if needed
const SERVER_HOST = 'chronosblade.aternos.me'; // Your server IP
const SERVER_PORT = 50847; // Your server port
const RECONNECT_DELAY = 10000; // 10 seconds

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: '1.21.10', // Force correct version
    timeout: 10000 // 10 sec timeout
  });

  bot.once('spawn', () => {
    console.log('Bot has spawned! Starting AFK actions...');
    startAFKActions();
  });

  bot.on('end', () => {
    console.log(`Bot disconnected. Reconnecting in ${RECONNECT_DELAY / 1000} seconds...`);
    setTimeout(createBot, RECONNECT_DELAY);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
  });
}

function startAFKActions() {
  if (!bot) return;

  // Continuously perform actions
  setInterval(() => {
    if (!bot.entity) return;

    // Randomly look around
    const yaw = Math.random() * 2 * Math.PI;
    const pitch = Math.random() * Math.PI - Math.PI / 2;
    bot.look(yaw, pitch, true);

    // Set basic movements
    bot.setControlState('forward', true);
    bot.setControlState('sprint', true);
    bot.setControlState('jump', Math.random() > 0.5); // Jump randomly
    bot.setControlState('back', false);
    bot.setControlState('left', Math.random() > 0.5); // Move slightly sideways
    bot.setControlState('right', Math.random() > 0.5);

    // Switch a random hotbar slot
    const slot = Math.floor(Math.random() * 9);
    bot.setQuickBarSlot(slot);
  }, 1000); // Every second
}

// Start the bot
createBot();

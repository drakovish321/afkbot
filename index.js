// index.js
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data')('1.21.10'); // match your server version
const express = require('express');

// ----- Express Web Server for Render -----
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('AFK Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

// ----- Mineflayer Bot Setup -----
const bot = mineflayer.createBot({
  host: 'chronosblade.aternos.me',  // change this to your server IP
  port: 50847,             // your correct port
  username: 'AFKBot',
  version: '1.21.10'       // make sure this matches your server
});

// Load pathfinder plugin
bot.loadPlugin(pathfinder);

// On spawn
bot.once('spawn', () => {
  console.log('Bot has spawned in the world!');

  // Setup pathfinder movements
  const defaultMove = new Movements(bot, mcData);
  defaultMove.blocksCantBreak.add(mcData.blocksByName.chest?.id || 54); // safe fallback for chest id
  bot.pathfinder.setMovements(defaultMove);

  // Example: move to coordinates (0, 64, 0)
  const goal = new goals.GoalBlock(0, 64, 0);
  bot.pathfinder.setGoal(goal);
});

// Error handling
bot.on('error', (err) => console.log('Bot error:', err));
bot.on('end', () => console.log('Bot disconnected, trying to reconnect in 5s...'));

// Optional: Reconnect loop
bot.on('kick', (reason) => {
  console.log('Kicked:', reason);
  setTimeout(() => {
    bot.connect();
  }, 5000);
});

bot.on('death', () => {
  console.log('Bot died, respawning...');
});

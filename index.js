const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'chronosblade.aternos.me',   // replace with your server IP
    port: 50847,               // replace if your server uses a different port
    username: 'AFKBot'         // your bot account
  });

  bot.on('spawn', () => {
    console.log('Bot spawned and ready!');
    startAfkActions(bot);
  });

  // Reconnect safely after 10 seconds if disconnected
  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000); // 10000 ms = 10 sec
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
  });
}

// Example AFK actions: run, jump, switch inventory slots
function startAfkActions(bot) {
  if (!bot.entity) return;

  const inventorySlots = [0,1,2,3,4]; // example slots to switch
  let slotIndex = 0;

  setInterval(() => {
    // Walk in a random direction
    const dx = Math.random() - 0.5;
    const dz = Math.random() - 0.5;
    bot.setControlState('forward', true);
    bot.setControlState('jump', Math.random() < 0.2); // random jumps
    bot.look(bot.entity.position.x + dx, bot.entity.position.y, bot.entity.position.z + dz, true);

    // Switch inventory slot
    bot.setQuickBarSlot(inventorySlots[slotIndex]);
    slotIndex = (slotIndex + 1) % inventorySlots.length;

  }, 2000); // every 2 seconds
}

createBot();

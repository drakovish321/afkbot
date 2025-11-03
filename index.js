const mineflayer = require('mineflayer');
const Vec3 = require('vec3');

const BOT_USERNAME = 'chronosbladebot';
const SERVER_HOST = 'chronosblade.aternos.me'; // Replace with your server IP
const SERVER_PORT = 50847; // Replace with your server port

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME
  });

  bot.on('login', () => {
    console.log('Bot logged in!');
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000); // reconnect after 10 sec
  });

  bot.on('error', err => {
    console.error('Bot error:', err);
  });

  bot.on('spawn', async () => {
    console.log('Bot spawned, starting loop...');
    await startLoop(bot);
  });
}

// Function to make the bot do the mine/place loop
async function startLoop(bot) {
  const distance = 50; // blocks to move forward

  while (true) {
    try {
      // Sprint forward
      bot.setControlState('sprint', true);
      bot.setControlState('forward', true);
      await sleep(50 * 250); // approx 50 blocks, assuming ~0.25s per block
      bot.setControlState('forward', false);
      bot.setControlState('sprint', false);

      // Mine the block in front
      const blockInFront = bot.blockAt(bot.entity.position.offset(0, -1, 1)); // block in front at foot level
      if (blockInFront) {
        await bot.dig(blockInFront);
        console.log('Mined a block');
      }

      // Place the block back
      const dirtSlot = bot.inventory.items().find(item => item.name.includes('dirt'));
      if (dirtSlot) {
        bot.equip(dirtSlot, 'hand');
        await bot.placeBlock(blockInFront, new Vec3(0, 1, 0)); // place on top
        console.log('Placed the block back');
      }

      await sleep(1000); // wait 1 sec before next iteration
    } catch (err) {
      console.error('Loop error:', err);
      await sleep(2000); // wait 2 sec and try again
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

createBot();

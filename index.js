// index.js
const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')

const BOT_OPTIONS = {
  host: 'chronosblade.aternos.me',  // Your server IP
  port: 50847,                       // Server port
  username: 'AFKBot',                // Bot username
  version: '1.21.10',                // Server Minecraft version
}

let bot

function createBot() {
  bot = mineflayer.createBot(BOT_OPTIONS)

  bot.on('spawn', () => {
    console.log('Bot spawned! Starting infinite AFK loop.')

    // Make sure the bot keeps running
    bot.setControlState('forward', true)
    bot.setControlState('sprint', true)

    // Randomized movement & jumping
    setInterval(() => {
      // Randomly strafe left/right
      const strafe = Math.random() > 0.5
      bot.setControlState('left', strafe)
      bot.setControlState('right', !strafe)

      // Random jump every tick sometimes
      bot.setControlState('jump', Math.random() < 0.3)

      // Rotate randomly
      const yawChange = (Math.random() - 0.5) * 0.2
      const pitchChange = (Math.random() - 0.5) * 0.1
      bot.look(bot.entity.yaw + yawChange, bot.entity.pitch + pitchChange, true)
    }, 500) // every half second

    // Switch inventory slots randomly
    setInterval(() => {
      const slot = Math.floor(Math.random() * 9)
      bot.setQuickBarSlot(slot)
    }, 2000) // every 2 seconds
  })

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10s...')
    setTimeout(createBot, 10000) // reconnect after 10 sec
  })

  bot.on('error', (err) => {
    console.log('Bot Error:', err)
  })
}

createBot()

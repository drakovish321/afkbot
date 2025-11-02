// index.js
const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')

const BOT_OPTIONS = {
  host: 'chronosblade.aternos.me',  // Server IP
  port: 50847,                       // Server port
  username: 'AFKBot',                // Bot username
  version: '1.21.10',                // Minecraft version
}

let bot

function createBot() {
  bot = mineflayer.createBot(BOT_OPTIONS)

  bot.on('spawn', () => {
    console.log('Bot spawned! Starting survival AFK loop.')

    // Start moving forward & sprinting
    bot.setControlState('forward', true)
    bot.setControlState('sprint', true)

    // Random movement & human-like behavior
    const movementLoop = setInterval(() => {
      // Randomly strafe left/right
      const strafeLeft = Math.random() < 0.5
      bot.setControlState('left', strafeLeft)
      bot.setControlState('right', !strafeLeft)

      // Small random rotation
      const yawChange = (Math.random() - 0.5) * 0.2
      const pitchChange = (Math.random() - 0.5) * 0.1
      bot.look(bot.entity.yaw + yawChange, bot.entity.pitch + pitchChange, true)

      // Jump occasionally
      bot.setControlState('jump', Math.random() < 0.25)

      // Dodge mobs if nearby
      const hostiles = Object.values(bot.entities).filter(e =>
        e.type === 'mob' &&
        e.position.distanceTo(bot.entity.position) < 4 &&
        ['Zombie', 'Skeleton', 'Spider', 'Creeper', 'Slime'].includes(e.name)
      )
      if (hostiles.length > 0) {
        bot.setControlState('back', true)
        bot.setControlState('forward', false)
      } else {
        bot.setControlState('back', false)
        bot.setControlState('forward', true)
      }
    }, 500) // every 0.5s

    // Randomly switch inventory slots
    const inventoryLoop = setInterval(() => {
      const slot = Math.floor(Math.random() * 9)
      bot.setQuickBarSlot(slot)
    }, 2000) // every 2 seconds

    // Cleanup on disconnect
    bot.on('end', () => {
      console.log('Bot disconnected. Clearing intervals and reconnecting in 10s...')
      clearInterval(movementLoop)
      clearInterval(inventoryLoop)
      setTimeout(createBot, 10000)
    })

    bot.on('error', (err) => {
      console.log('Bot Error:', err)
    })
  })
}

createBot()

const mineflayer = require('mineflayer')

const username = 'AFKBot' // Bot username
const host = 'chronosblade.aternos.me:50847' // Your server
const port = 50847 // Server port
const version = '1.21.10' // Minecraft version

function startBot() {
  const bot = mineflayer.createBot({ username, host, port, version })

  // Handle disconnections and auto-reconnect
  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10 seconds...')
    setTimeout(startBot, 10000)
  })

  bot.on('error', (err) => {
    console.log('Bot error:', err)
  })

  bot.once('spawn', () => {
    console.log('Bot spawned!')

    // Continuous movement loop
    setInterval(() => {
      if (!bot.entity) return
      bot.setControlState('forward', true)
      bot.setControlState('sprint', true)
      bot.setControlState('jump', Math.random() > 0.5) // random jump
    }, 500)

    // Switch inventory slots every 3 seconds
    let slot = 0
    setInterval(() => {
      if (!bot.inventory) return
      slot = (slot + 1) % 9
      bot.setQuickBarSlot(slot)
    }, 3000)

    // Optional: rotate left/right for circling
    setInterval(() => {
      if (!bot.entity) return
      const yaw = bot.entity.yaw + 0.2
      bot.look(yaw, bot.entity.pitch, false)
    }, 200)
  })
}

startBot()

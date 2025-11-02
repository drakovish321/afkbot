const mineflayer = require('mineflayer')
const mcData = require('minecraft-data')('1.21.10')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const express = require('express')

// ---- Web server for uptime ----
const app = express()
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.send('AFK Bot running!'))
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`))

// ---- Bot creation ----
function createBot() {
  const bot = mineflayer.createBot({
    host: 'YOUR_SERVER_IP', // Replace with your server IP
    port: 50847,
    username: 'AFKBot123',
    version: '1.21.10'
  })

  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('Bot spawned!')

    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)

    // Move forward and sprint indefinitely
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('forward', true)
        bot.setControlState('sprint', true)
      }
    }, 1000)
  })

  bot.on('end', () => {
    console.log('Bot disconnected, reconnecting in 5s...')
    setTimeout(createBot, 5000)
  })

  bot.on('error', err => console.log('Bot error:', err))
}

createBot()

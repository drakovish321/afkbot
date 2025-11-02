// index.js
const mineflayer = require('mineflayer')
const mcData = require('minecraft-data')('1.21.10')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const express = require('express')

// ---- Web server for Render uptime ----
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('AFK Bot is running!')
})

app.listen(PORT, () => {
  console.log(`Web server is listening on port ${PORT}`)
})

// ---- Bot creation function ----
function createBot() {
  const bot = mineflayer.createBot({
    host: 'YOUR_SERVER_IP', // Replace with your server IP
    port: 25565,            // Replace with your server port if not default
    username: 'awesomedude33',
    version: '1.21.10'
  })

  // Load pathfinder plugin
  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('Bot spawned successfully!')

    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)

    // Walk forward indefinitely and sprint
    setInterval(() => {
      bot.setControlState('forward', true)
      bot.setControlState('sprint', true)
    }, 1000)
  })

  // Auto-reconnect
  bot.on('end', () => {
    console.log('Bot disconnected, reconnecting in 5 seconds...')
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log('Bot error:', err)
  })

  // Optional: log death messages
  bot.on('death', () => {
    console.log('Bot died, respawning...')
  })
}

// Start the bot
createBot()

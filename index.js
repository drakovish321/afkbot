// index.js
const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 10000

// Serve a simple endpoint so Render knows the service is live
app.get('/', (req, res) => {
  res.send('AFK Bot is running!')
})

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`)
})

// ---- MINEFLAYER BOT CONFIG ----
const bot = mineflayer.createBot({
  host: 'chronosblade.aternos.me', // your server IP
  port: 50847,                      // your server port
  username: 'AFKBot',               // bot username
  version: '1.21.10'                // Minecraft version
})

// When the bot spawns
bot.once('spawn', () => {
  console.log('Bot has spawned in the world!')

  // Continuously sprint forward
  function sprintForward() {
    bot.setControlState('forward', true)
    bot.setControlState('sprint', true)
    bot.setControlState('jump', false)
  }

  sprintForward()

  // Optional: periodically ensure it’s still moving
  setInterval(() => {
    if (!bot.entity) return
    sprintForward()
  }, 5000)
})

// Log errors
bot.on('error', err => console.log('Bot Error:', err))
bot.on('end', () => console.log('Bot disconnected from server.'))

// Optional: log mobs/entities spawning
bot.on('entitySpawn', entity => {
  console.log(`Entity spawned: ${entity.displayName || entity.username || entity.type}`)
})

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

  let angle = 0

  // Loop to make the bot walk in a circle
  setInterval(() => {
    if (!bot.entity) return

    const radius = 3 // circle radius in blocks

    // Calculate direction vector for circular movement
    const dx = Math.cos(angle)
    const dz = Math.sin(angle)

    // Make bot move forward and rotate slightly
    bot.look(bot.entity.position.x + dx, bot.entity.position.y, bot.entity.position.z + dz, true)
    bot.setControlState('forward', true)
    bot.setControlState('sprint', true)
    bot.setControlState('jump', true)

    // Increment angle for circular movement
    angle += 0.05
    if (angle > 2 * Math.PI) angle = 0
  }, 100) // update every 100ms
})

// Log errors
bot.on('error', err => console.log('Bot Error:', err))
bot.on('end', () => console.log('Bot disconnected from server.'))

// Optional: log mobs/entities spawning
bot.on('entitySpawn', entity => {
  console.log(`Entity spawned: ${entity.displayName || entity.username || entity.type}`)
})

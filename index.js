// index.js

const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const mcData = require('minecraft-data')('1.21.10') // Force correct server version
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
  host: 'chronosblade.aternos.me',      // Replace with your server IP
  port: 50847,                 // Replace with your server port
  username: 'AFKBot',          // Replace with your bot username
  version: '1.21.10'           // Force correct Minecraft version
})

// Load the pathfinder plugin
bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  console.log('Bot has spawned in the world!')

  // Initialize movements
  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  // Example: Walk to the nearest chest
  const chestBlock = bot.findBlock({
    matching: mcData.blocksByName.chest.id,
    maxDistance: 32
  })

  if (chestBlock) {
    const goal = new goals.GoalBlock(chestBlock.position.x, chestBlock.position.y, chestBlock.position.z)
    bot.pathfinder.setGoal(goal)
    console.log('Moving to nearest chest...')
  } else {
    console.log('No chest found nearby.')
  }
})

// Log errors
bot.on('error', err => console.log('Bot Error:', err))
bot.on('end', () => console.log('Bot disconnected from server.'))

// Optional: log mob spawns using the new displayName property
bot.on('entitySpawn', entity => {
  console.log(`Entity spawned: ${entity.displayName}`)
})

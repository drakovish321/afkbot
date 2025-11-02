const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const http = require('http')

// -----------------------
// Minimal HTTP server to keep the service alive
// -----------------------
const PORT = process.env.PORT || 3000
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('AFK bot is running!\n')
}).listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`))

// -----------------------
// Mineflayer bot
// -----------------------
function startBot() {
  const bot = mineflayer.createBot({
    host: "chronosblade.aternos.me",
    port: 25565,
    username: "awesomedude33",
    version: "1.12.2"
  })

  bot.loadPlugin(pathfinder)

  bot.on('spawn', () => {
    console.log("Bot joined the server!")

    // Movement settings
    const defaultMove = new Movements(bot)
    bot.pathfinder.setMovements(defaultMove)

    // Move forward in a straight line
    const initialPos = bot.entity.position.clone()

    function walkForward() {
      const targetX = initialPos.x + 1000
      const goal = new goals.GoalBlock(Math.floor(targetX), Math.floor(initialPos.y), Math.floor(initialPos.z))
      bot.pathfinder.setGoal(goal)
      bot.setControlState('sprint', true)
    }

    walkForward()

    // Auto-jump
    bot.on('physicTick', () => bot.setControlState('jump', true))

    // Random head movement
    setInterval(() => {
      bot.look(bot.entity.yaw + (Math.random() - 0.5), bot.entity.pitch, true)
    }, 2000)
  })

  // Auto-reconnect
  bot.on('end', reason => {
    console.log(`Bot disconnected: ${reason}. Reconnecting in 5 seconds...`)
    setTimeout(startBot, 5000)
  })

  bot.on('error', err => console.log(`Bot error: ${err}`))
}

startBot()

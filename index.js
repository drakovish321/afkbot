const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

function startBot() {
  const bot = mineflayer.createBot({
    host: "chronosblade.aternos.me",  // your server IP
    port: 25565,
    username: "awesomedude33",         // bot username
    version: "1.12.2"                  // Mineflayer version for 1.12.x
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
      const targetX = initialPos.x + 1000  // go 1000 blocks forward
      const goal = new goals.GoalBlock(Math.floor(targetX), Math.floor(initialPos.y), Math.floor(initialPos.z))
      bot.pathfinder.setGoal(goal)
      bot.setControlState('sprint', true)
    }

    walkForward()

    // Auto-jump to avoid getting stuck
    bot.on('physicTick', () => {
      bot.setControlState('jump', true)
    })

    // Random head movement every 2 seconds
    setInterval(() => {
      bot.look(bot.entity.yaw + (Math.random() - 0.5), bot.entity.pitch, true)
    }, 2000)
  })

  // Auto-reconnect if disconnected
  bot.on('end', reason => {
    console.log(`Bot disconnected: ${reason}. Reconnecting in 5 seconds...`)
    setTimeout(startBot, 5000)
  })

  bot.on('error', err => console.log(`Bot error: ${err}`))
}

startBot()

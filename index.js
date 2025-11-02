const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: "chronosblade.aternos.me", // your server IP
    port: 25565,
    username: "awesomedude33",        // bot username
    version: "1.12.2"                 // Mineflayer version for 1.12.x servers
  })

  bot.on('spawn', () => {
    console.log("Bot joined the server!")

    // Sprint forward
    bot.setControlState('forward', true)
    bot.setControlState('sprint', true)

    // Auto-jump to avoid getting stuck
    bot.on('physicTick', () => bot.setControlState('jump', true))

    // Random head movement to look more human
    setInterval(() => {
      bot.look(bot.entity.yaw + (Math.random() - 0.5), bot.entity.pitch, true)
    }, 2000)
  })

  // Auto-reconnect if disconnected
  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}`)
    console.log("Reconnecting in 5 seconds...")
    setTimeout(startBot, 5000)
  })

  bot.on('error', (err) => {
    console.log(`Bot error: ${err}`)
  })
}

startBot()

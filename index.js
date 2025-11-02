const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: "chronosblade.aternos.me",   // change to your server IP
    port: 50847,               // Aternos port (default 25565)
    username: "awesomedude33", // bot username
    version: "1.12.2"
  })

  bot.on('spawn', () => {
    console.log("Bot joined the server!")

    // walk forward forever
    bot.setControlState('forward', true)
  })

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}`)
    console.log("Reconnecting in 5 seconds...")
    setTimeout(startBot, 5000) // reconnect after 5 seconds
  })

  bot.on('error', (err) => {
    console.log(`Bot error: ${err}`)
  })
}

startBot()

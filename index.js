const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: "YOUR-ATERNOS-IP",
    port: 25565,
    username: "awesomedude33",
    version: "auto"
  })

  bot.on('spawn', () => {
    console.log("bot joined!")

    setInterval(() => {
      // walk forward forever
      bot.setControlState('forward', true)
    }, 1000)
  })

  bot.on('end', () => {
    console.log("bot kicked — reconnecting…")
    setTimeout(startBot, 5000)
  })
}

startBot()

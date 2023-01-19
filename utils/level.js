const config = require('../config')
const { MongoLevel } = require('../library/user')
const talkedRecentlys = new Map()
const rand = require('random')
module.exports = async function(client, message) {
    if (message.author.bot || !message.guild) return
    const talkedRecently = talkedRecentlys.get(`${message.guild.id}-${message.author.id}`)
    if (Date.now() < talkedRecently) return
    talkedRecentlys.set(`${message.guild.id}-${message.author.id}`, Date.now() + 60000)
    setTimeout(() => talkedRecentlys.delete(`${message.guild.id}-${message.author.id}`), 60000)

    const amount = rand.int(config.xp.reward.min, config.xp.reward.max)
    const { level, xp } = await new MongoLevel(message.guild.id, message.author.id).add({ amount: amount, type: 'xp' })
    const needed = config.xp.base + (level * config.xp.multiplier)
    if (xp >= needed) {
        new MongoLevel(message.guild.id, message.author.id).up(xp - needed)
        return message.channel.send(`${message.author} leveled up to **level ${level + 1}**!`)
    }
}
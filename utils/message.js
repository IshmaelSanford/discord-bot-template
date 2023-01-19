const ms = require('ms')
const maps = new Map()
const humanize = require('humanize-duration')
const { MongoMute } = require('../library/guild')
module.exports = async function(client, message) {
    if (!message.guild || message.author.bot) return
    if (!message.guild.database) message.guild.database = await new MongoMute(message.guild.id).getGuildData()
    const role = message.guild.roles.cache.get(message.guild.database.muteId)
    if (!role) return
    // if (message.member.roles.cache.has(role.id)) return

    let map = maps.get(message.author.id)
    if (!map) return maps.set(message.author.id, { times: 1, last_timestamp: message.createdTimestamp })
    let { last_timestamp, times } = map
    if (message.createdTimestamp - last_timestamp >= ms(client.config.spam.message.last_time)) return maps.set(message.author.id, { times: 1, last_timestamp: message.createdTimestamp })
    else times++
    if (times < client.config.spam.message.max) return maps.set(message.author.id, { times, last_timestamp: message.createdTimestamp })

    message.member.roles.add(role.id)
    message.member.send(`You have been muted for **${humanize(ms(client.config.spam.mentions.duration), { largest: 1 })}** for spamming`)
    new MongoMute(message.guild.id).mute({
        userId: message.author.id,
        reason: "Spamming",
        end: Date.now() + ms(client.config.spam.mentions.duration),
        timestamp: Date.now()
    })
    maps.delete(message.author.id)
}
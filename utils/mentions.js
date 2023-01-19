const ms = require('ms')
const humanize = require('humanize-duration')
const maps = new Map()
const { MongoMute } = require('../library/guild')
module.exports = async function (client, message) {
    if (!message.guild || message.author.bot) return
    if (!message.guild.database) message.guild.database = await new MongoMute(message.guild.id).getGuildData()
    const role = message.guild.roles.cache.get(message.guild.database.muteId)
    if (!role) return
    if (message.member.roles.cache.has(role.id)) return

    if (message.mentions.users.size) {
        if (message.mentions.users.size >= client.config.spam.mentions.max) {
            message.member.roles.add(role.id)
            message.member.send(`You have been muted for **${humanize(ms(client.config.spam.mentions.duration), { largest: 1 })}** for excessively mentioning members`)
            new MongoMute(message.guild.id).mute({
                userId: message.author.id,
                reason: "Excessive mentions",
                end: Date.now() + ms(client.config.spam.mentions.duration),
                timestamp: Date.now()
            })
        }

        let map = maps.get(message.author.id)
        if (!map) {
            map = { times: message.mentions.users.size, last_timestamp: message.createdTimestamp }
            return maps.set(message.author.id, map)
        }
        let { times, last_timestamp } = map
        
        if (message.createdTimestamp - last_timestamp <= ms(client.config.spam.mentions.time)) times += message.mentions.users.size
        else times = message.mentions.users.size
        if (times < client.config.spam.mentions.max) return maps.set(message.author.id, { times, last_timestamp: message.createdTimestamp })

        message.member.roles.add(role.id)
        message.member.send(`You have been muted for **${humanize(ms(client.config.spam.mentions.duration), { largest: 1 })}** for excessively mentioning members`)
        new MongoMute(message.guild.id).mute({
            userId: message.author.id,
            reason: "Excessive mentions",
            end: Date.now() + ms(client.config.spam.mentions.duration),
            timestamp: Date.now()
        })
    }
}
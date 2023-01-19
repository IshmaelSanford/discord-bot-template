const { MessageEmbed } = require("discord.js")
const { MongoEconomy } = require("../../library/user")
const cooldowns = new Map()
const ms = require('ms')
const humanize = require('humanize-duration')
module.exports = {
    name: 'joinmafia',
    aliases: ['join'],
    description: "Try to join the Mafia, you must have at least 100,000 to even have a chance",
    category: 'mafia',
    run: async function(message, args) {
        const data = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (data.mafia) return message.reply(`you are already part of the Mafia.`)
        
        const cooldown = cooldowns.get(message.author.id)
        if (Date.now() < cooldown) return message.react(`⏰`)
        cooldowns.set(message.author.id, Date.now() + ms('1h'))
        setTimeout(() => cooldowns.delete(message.author.id), ms('1h'))

        if (data.wallet < 100000) return message.reply(`you must at least have **${message.client.config.economy.symbol.front}100000${message.client.config.economy.symbol.back}** to join the Mafia!`)

        const chance = 100/500000 * data.wallet
        const odds = Math.random() * 100
        if (chance < odds) return message.reply(`you tried to join the **Mafia** and **failed**! Try again in \`12 hours\` for a chance of re-joining. You hads a **${odds}%** chance of joining.`)
        
        let costs = []
        let roleIds = []
        for (const cost in message.client.config.mafia) {
            costs.push(cost)
            if (message.member.roles.cache.has(message.client.config.mafia[cost].roleId)) roleIds.push(message.client.config.mafia[cost].roleId)
        }
        costs = costs.filter(c => data.wallet >= c)
        const { roleId } = message.client.config.mafia[costs[costs.length - 1]]
        const role = message.guild.roles.cache.get(roleId)

        roleIds = roleIds.filter(r => r !== roleId)
        if (roleIds.length) message.member.roles.remove(roleIds)
        
        if (!message.member.roles.cache.has(role.id)) message.member.roles.add(role)
        new MongoEconomy(message.guild.id, message.author.id).set({ type: 'mafia', amount: true })
        message.channel.send(`Congratulations ${message.author}, you succeeded in joining the **Mafia**! Check your new role for your ranking!`)
    }
}
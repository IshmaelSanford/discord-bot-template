const { MessageEmbed } = require("discord.js")
const { MongoEconomy } = require("../../library/user")
module.exports = {
    name: 'promote',
    description: "Promotes in the Mafia, if you have the money",
    category: 'mafia',
    run: async function(message) {
        const data = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (!data.mafia) return message.reply(`you aren't even part of the Mafia.`)

        if (data.wallet >= 700000) {
            let economy = (await new MongoEconomy(message.guild.id, message.author.id).get(true)).filter(data => data.mafia)
            economy.sort((a, b) => b.wallet - a.wallet)
            economy = economy.map(data => data.userId)
            if (economy.indexOf(message.author.id) == 0) return message.reply(`you're already considered the Godfather to some. If you don't have the role, wait a little longer or ask an administrator to give it to you.`)
            if (economy.indexOf(message.author.id) > 0 && economy.indexOf(message.author.id) <= 3) return message.reply(`there have been rumors that you were already part of the top three ring holders. If you don't have the role, wait a little longer or ask an administrator to give it to you.`)
        }

        let costs = []
        let roleIds = []
        const allRoleIds = []
        for (const cost in message.client.config.mafia) {
            costs.push(cost)
            if (message.member.roles.cache.has(message.client.config.mafia[cost].roleId)) roleIds.push(message.client.config.mafia[cost].roleId)
            allRoleIds.push(message.client.config.mafia[cost].roleId)
        }
        costs = costs.filter(c => data.wallet >= c)
        const { roleId } = message.client.config.mafia[costs[costs.length - 1]]
        const role = message.guild.roles.cache.get(roleId)

        let currentTierIndex = -1
        const nextTierIndex = allRoleIds.indexOf(roleId)
        for (const roleId of allRoleIds) if (message.member.roles.cache.has(roleId)) currentTierIndex = allRoleIds.indexOf(roleId)
        if (currentTierIndex == nextTierIndex) {
            if (currentTierIndex == 2) return message.reply(`you're already the highest tier that you can possibly be promoted to. Maybe earn yourself some more money to get some prestigious privileges that a promotion can't offer...`)
            return message.reply(`no can do buddy, you stil need to earn a little bit more to promote yourself.`)
        }
        
        roleIds = roleIds.filter(r => r !== roleId)
        if (roleIds.length) message.member.roles.remove(roleIds)
        if (!message.member.roles.cache.has(role.id)) message.member.roles.add(roleId)
        message.channel.send(`Congratulations ${message.author}, you were promoted! Check your new role for your ranking!`)
    }
}
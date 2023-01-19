const { MongoEconomy } = require('../../library/user')
const rand = require('random')
module.exports = {
    name: 'rob',
    minArgs: 1,
    expectedArgs: '<@member/id>',
    description: "Allow you to rob a member",
    category: 'mafia',
    run: async function(message, args) {
        const data = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (!data.mafia) return message.reply(`you aren't part of the **Mafia**.`)

        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(()=>{return})

        const { wallet } = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (wallet < message.client.config.rob.requirement) return message.reply(`your target must at least have **${message.client.config.economy.symbol.front}${message.client.config.rob.requirement}${message.client.config.economy.symbol.back}** for the robbing to be worth it.`)

        const roleIds = []
        for (const cost in message.client.config.mafia) for (const property in message.client.config.mafia[cost]) roleIds.push(message.client.config.mafia[cost][property])
        
        const requiredTierIndex = 1
        let currentTierIndex = -1
        for (const roleId of roleIds) if (message.member.roles.cache.has(roleId)) currentTierIndex = roleIds.indexOf(roleId)

        if (currentTierIndex < requiredTierIndex) return message.reply(`you don't have the required role to use this command. Maybe try using the \`${message.client.config.prefix}promote\` command see if you can get yourself promoted. You must at least have **${message.client.config.economy.symbol.front}500000${message.client.config.economy.symbol.back}**`)
        
        const odds = message.client.config.rob.chance.base + (message.client.config.rob.chance.increase * (data.wallet / 100000))
        const chance = Math.random() * 100
        if (chance > odds) return message.reply(`you failed to rob ${member}`)

        const min = wallet * (message.client.config.rob.reward.min/100)
        const max = wallet * (messag.eclient.config.rob.reward.max/100)
        const amount = rand.int(min, max)
        new MongoEconomy(message.guild.id, member.id).add({ amount: -amount, type: 'wallet' })
        new MongoEconomy(message.guild.id, message.author.id).add({ awmount: amount, type: 'wallet' })
        return message.reply(`you stole **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}** from ${member}!`)
    }
}
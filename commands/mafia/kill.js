const { MongoEconomy } = require('../../library/user')
const rand = require('random')
module.exports = {
    name: 'kill',
    minArgs: 1,
    expectedArgs: '<@member/id>',
    description: "Allow you to kill a member",
    category: 'mafia',
    run: async function(message, args) {
        const data = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (!data.mafia) return message.reply(`you aren't part of the **Mafia**.`)
        if (data.wallet < 700000) return message.reply(`you must at least have **${message.client.config.economy.symbol.front}700000${message.client.config.economy.symbol.back}** to kill someone.`)

        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(()=>{return})

        const roleIds = []
        for (const cost in message.client.config.mafia) for (const property in message.client.config.mafia[cost]) roleIds.push(message.client.config.mafia[cost][property])
        
        const requiredTierIndex = 2
        let currentTierIndex = -1
        for (const roleId of roleIds) if (message.member.roles.cache.has(roleId)) currentTierIndex = roleIds.indexOf(roleId)

        if (currentTierIndex < requiredTierIndex) return message.reply(`you don't have the required role to use this command. Maybe try using the \`${message.client.config.prefix}promote\` command see if you can get yourself promoted. You must at least have **${message.client.config.economy.symbol.front}700000${message.client.config.economy.symbol.back}**`)
        
        const odds = message.client.config.kill.chance.base + (message.client.config.kill.chance.increase * (data.wallet / 100000))
        const chance = Math.random() * 100
        if (chance > odds) {
            const loss = data.wallet * (message.client.config.kill.failure/100)
            new MongoEconomy(message.guild.id, message.author.id).set({ amount: data.wallet - loss, type: 'wallet' })
            return message.reply(`you failed to kill ${member} and lost **${message.client.config.economy.symbol.front}${loss}${message.client.config.economy.symbol.back}**`)
        }

        new MongoEconomy(message.guild.id, member.id).set({ amount: 0, type: 'wallet' })
        return message.reply(`you successfully killed ${member} and wiped their balance`)
    }
}
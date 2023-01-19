const { MongoEconomy } = require("../../library/user")

module.exports = {
    name: 'set-bal',
    aliases: ['setbal', 'bal-set', 'balset'],
    description: "Sets someone's balance",
    minArgs: 2,
    permissions: 'ADMINISTRATOR',
    expectedArgs: '<@member/id> <amount>',
    category: 'economy',
    run: async function (message, args) {
        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(() => { return })
        if (!member) return message.reply(`**${args[0]}** is an invalid member`)
    
        const amount = Math.floor(args[1])
        if (isNaN(amount)) return message.reply(`**${args[1]}** is an invalid number`)
    
        new MongoEconomy(message.guild.id, member.id).set({ amount: amount, type: 'wallet' })
        return message.reply(`Set ${member}'s balance to **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**`)
    }
}
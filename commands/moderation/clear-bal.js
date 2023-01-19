const { MongoEconomy } = require("../../library/user")

module.exports = {
    name: 'clear-bal',
    aliases: ['clearbal', 'balclear', 'bal-clear'],
    description: "Clears someone's balance",
    minArgs: 1,
    permissions: 'ADMINISTRATOR',
    expectedArgs: '<@member/id>',
    category: 'economy',
    run: async function (message, args) {
        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(() => { return })
        if (!member) return message.reply(`**${args[0]}** is an invalid member`)
    
        new MongoEconomy(message.guild.id, member.id).set({ amount: 0, type: 'wallet' })
        return message.reply(`Cleared ${member}'s balance`)
    }
}
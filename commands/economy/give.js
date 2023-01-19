const {MongoEconomy} = require('../../library/user')
module.exports = {
    name: 'give',
    description: "Give a member your balance",
    minArgs: 2,
    expectedArgs: "<@member/id> <amount>",
    category: 'economy',
    run: async function(message, args) {
        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(() => { return })
        if (!member) return message.reply(`**${args[0]}** is an invalid member`)
        if (member.id == message.author.id) return message.reply("you can't give yourself money")
    
        const { wallet: myWallet } = await new MongoEconomy(message.guild.id, message.author.id).get()
        const amount = Math.floor(args[1])
        if (isNaN(amount)) return message.reply(`**${args[0]}** is an invalid number`)
        if (amount < 1) return message.reply(`you can't give nothing`)
        if (amount > myWallet) return message.reply(`you can only give at most **${message.client.config.economy.symbol.front}${myWallet}${message.client.config.economy.symbol.back}**`)

        new MongoEconomy(message.guild.id, message.author.id).add({ amount: -amount, type: 'wallet' })
        new MongoEconomy(message.guild.id, member.id).add({ amount, type: 'wallet' })
        return message.reply(`you gave ${member} **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**`)
    }
}
const { MongoEconomy } = require("../../../library/user")
const rand = require('random')
const humanize = require('humanize-duration')
const cooldowns = new Map()
module.exports = {
    name: 'coinflip',
    aliases: ['flip'],
    description: "Make a bet and flip a coin",
    minArgs: 2,
    expectedArgs: '<head/tail> <amount>',
    category: 'gambling',
    run: async function(message, args) {
        const cooldown = cooldowns.get(message.author.id)
        if (Date.now() < cooldown) {
            const remaining = cooldown - Date.now()
            return message.reply(`⏰ Please wait for **${humanize(remaining, { largest: 1, round: true })}** before trying to \`${this.name}\` again`)
        }
        cooldowns.set(message.author.id, Date.now() + 5000)
        setTimeout(() => cooldowns.delete(message.author.id), 5000)

        const { wallet } = await new MongoEconomy(message.guild.id, message.author.id).get()

        const input = args[0].toLowerCase()
        if (!['head', 'heads', 'tail', 'tails'].includes(input)) return message.reply(`**${args[0]}** is an invalid choice, state either \`heads\` or \`tails\``)

        let choice = 'heads'
        if (['tail', 'tails'].includes(input)) choice = 'tails'
        
        let amount = Math.floor(args[1])
        if (isNaN(amount)) {
            if (args[1].toLowerCase() == 'all') amount = wallet
            else return message.reply(`**${args[1]}** is an invalid number`)
        }
        if (wallet < 1) return message.reply("you don't have anything to bet with.")
        if (amount < 1) return message.reply(`you can't bet nothing.`)
        if (amount > wallet) return message.reply(`you can only bet the maximum of **${message.client.config.economy.symbol.front}${wallet}${message.client.config.economy.symbol.back}**`)
        new MongoEconomy(message.guild.id, message.author.id).add({ amount: -amount, type: 'wallet' })
        
        win = false
        const sides = ['heads', 'tails']
        const side = sides[rand.int(0, sides.length - 1)]
        if (side == choice) {
            win = true
            new MongoEconomy(message.guild.id, message.author.id).add({ amount: amount * 2, type: 'wallet' })
        }
        const string = `${message.author} you bet **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**!`
        message.channel.send(`${string}\n> 🪙\nFlipping. . .`)
        setTimeout(function() {
            if (win) message.reply(`You won **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**! You now have **${message.client.config.economy.symbol.front}${wallet + amount}${message.client.config.economy.symbol.back}** in your balance!`)
            else message.reply(`You lost everything. You now have **${message.client.config.economy.symbol.front}${wallet - amount}${message.client.config.economy.symbol.back}**.`)
        }, 1200)
    }
}
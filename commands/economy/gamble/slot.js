const { MongoEconomy } = require("../../../library/user")
const rand = require('random')
const humanize = require('humanize-duration')
const cooldowns = new Map()
module.exports = {
    name: 'slot',
    aliases: ['slotmachine', 'slots'],
    description: "Bet and play slots",
    minArgs: 1,
    expectedArgs: '<amount>',
    category: 'gambling',
    run: async function(message, args) {
        const cooldown = cooldowns.get(message.author.id)
        if (Date.now() < cooldown) {
            const remaining = cooldown - Date.now()
            return message.reply(`⏰ Please wait for **${humanize(remaining, { largest: 1, round: true })}** before trying to \`${this.name}\` again`)
        }
        cooldowns.set(message.author.id, Date.now() + 11000)
        setTimeout(() => cooldowns.delete(message.author.id), 11000)

        const { wallet } = await new MongoEconomy(message.guild.id, message.author.id).get()

        let amount = Math.floor(args[0])
        if (isNaN(amount)) {
            if (args[0].toLowerCase() == 'all') amount = wallet
            else return message.reply(`**${args[0]}** is an invalid number`)
        }
        if (amount < 1) return message.reply(`you can't bet nothing`)
        if (amount > wallet) return message.reply(`you can only bet the maximum of **${message.client.config.economy.symbol.front}${wallet}${message.client.config.economy.symbol.back}**`)
        new MongoEconomy(message.guild.id, message.author.id).add({ amount: -amount, type: 'wallet' })
        
        const string = `${message.author}, you bet **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**\n`
        const emojis = []
        const slot = ['❓', '❓', '❓']
        for (const emoji in message.client.config.economy.slots) emojis.push(emoji)
        
        const msg = await message.channel.send(`${string}> ${slot.map(s => `\`${s}\``).join(' ')}\n*Rolling. . .*`)

        let odds = 100/emojis.length
        setTimeout(function() {
            const emoji = emojis[rand.int(0, slot.length)]
            slot[0] = emoji
            odds += message.client.config.economy.slots[emoji].chances
            msg.edit(`${string}> ${slot.map(s => `\`${s}\``).join(' ')}\n*Rolling. . .*`)
        }, 1000)
        setTimeout(function() {
            const chances = Math.random() * 100
            if (odds <= chances) slot[1] = slot[0]
            else {
                const emoji = emojis[rand.int(0, slot.length)]
                slot[1] = emoji
            }
            if (slot[0] == slot[1]) odds = 98
            else odds = 100/emojis.length
            msg.edit(`${string}> ${slot.map(s => `\`${s}\``).join(' ')}\n*Rolling. . .*`)
        }, 3000)
        setTimeout(function() {
            const chances = Math.random() * 100
            if (odds >= chances) slot[2] = slot[0]
            else slot[2] = emojis[rand.int(0, slot.length)]

            let str = `${message.author}, you lost! You now have **${message.client.config.economy.symbol.front}${wallet - amount}${message.client.config.economy.symbol.back}** in your balance!`
            if (slot[0] == slot[1] && slot[1] == slot[2]) {
                const multiplier = message.client.config.economy.slots[slot[0]].multiplier
                const win = Math.floor(amount * multiplier)
                new MongoEconomy(message.guild.id, message.author.id).add({ amount: amount + win, type: 'wallet' }) 
                str = `${message.author}, you won **${message.client.config.economy.symbol.front}${win}${message.client.config.economy.symbol.back}**! You currently have **${message.client.config.economy.symbol.front}${wallet + win}${message.client.config.economy.symbol.back}** in your balance!`
            }
            msg.edit(`${message.author}, you bet **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**\n> ${slot.map(s => `\`${s}\``).join(' ')}\n*Rolling. . .*`)
            message.channel.send(str)
        }, 7000)
    }
}
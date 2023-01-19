const humanize = require('humanize-duration')
const cooldowns = new Map()
const { MongoEconomy } = require('../../library/user')
module.exports = {
    name: 'balance',
    aliases: ['bal'],
    description: "Checks your balance",
    category: 'economy',
    run: async function (message, args) {
        const cooldown = cooldowns.get(message.author.id)
        if (Date.now() < cooldown) {
            const remaining = cooldown - Date.now()
            return message.reply(`⏰ Please wait for **${humanize(remaining, { largest: 1, round: true })}** before trying to use \`${this.name}\` again`)
        }
        cooldowns.set(message.author.id, Date.now() + 5000)
        setTimeout(() => cooldowns.delete(message.author.id), 5000)

        let member = message.member
        if (args.length) {
            if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
            member = await message.guild.members.fetch(args[0]).catch(() => { return })
            if (!member) member = message.member
        }
        const data = await new MongoEconomy(message.guild.id, member.id).get()
        const { wallet } = data
        message.channel.send(`${member} has **${message.client.config.economy.symbol.front}${wallet}${message.client.config.economy.symbol.back}** in their balance.`)
    }
}
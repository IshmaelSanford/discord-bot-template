const ms = require('ms')
const rand = require('random')
const humanize = require('humanize-duration')
const { MongoEconomy } = require('../../../library/user')
const cooldowns = new Map()
module.exports = {
    name: 'daily',
    description: "Earns a daily amount",
    category: 'economy',
    run: async function(message) {
        const cooldown = cooldowns.get(message.author.id)
        if (Date.now() < cooldown) {
            const remaining = cooldown - Date.now()
            return message.reply(`⏰ Please wait for **${humanize(remaining, { largest: 1, round: true })}** before trying to \`${this.name}\` again`)
        }
        const economy = message.client.config.economy[`${this.name}`]
        cooldowns.set(message.author.id, Date.now() + ms(economy.cooldown))
        setTimeout(() => cooldowns.delete(message.author.id), ms(economy.cooldown))

        const amount = rand.int(economy.reward.min, economy.reward.max)
        message.reply(`you've earned your daily **${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}**!`)
        return new MongoEconomy(message.guild.id, message.author.id).add({ amount: amount, type: 'wallet' })
    }
}
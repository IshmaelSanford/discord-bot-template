const { MessageEmbed } = require("discord.js")
const { MongoShop } = require("../../library/guild")
module.exports = {
    name: 'edit-price',
    aliases: ['editprice', 'editcost', 'edit-cost'],
    description: "Edits a role in the shop",
    ownerOnly: true,
    minArgs: 2,
    expectedArgs: '<@&role/id> <price>',
    category: 'owner',
    run: async function (message, args) {
        const embed = new MessageEmbed()
        if (args[0].startsWith('<@&') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const role = message.guild.roles.cache.find(r => [r.id, r.name].includes(args[0]))
        if (!role) return message.reply(`**${args[0]}** is an invalid role`)

        const data = await new MongoShop(message.guild.id).get({ roleId: role.id })
        if (!data) return message.reply(embed.setDescription(`${role} is not being sold on the shop`))

        const amount = Math.floor(args[1])
        if (isNaN(amount)) return message.reply(`**${args[1]}** is an invalid number`)
        if (amount < 0) return message.reply(`I need to earn something from selling this role!`)

        new MongoShop(message.guild.id).update({ roleId: role.id, property: 'cost', value: amount })
        return message.reply(embed.setDescription(`${role}'s cost has been updated, it will now be sold for [\`${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}\`](https://discord.com)`))
    }
}
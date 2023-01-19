const { MessageEmbed } = require('discord.js')
const { MongoShop } = require('../../library/guild')
const { MongoEconomy } = require('../../library/user')
module.exports = {
    name: 'buy',
    minArgs: 1,
    expectedArgs: '<item-number/name>',
    description: "Buys an item from the shop",
    category: 'economy',
    run: async function (message, args) {
        let choice = args[0]

        const items = (await new MongoShop(message.guild.id).get({ guild: true })).filter(item => message.guild.roles.cache.get(item.roleId) && !item.name.length)
        if (!items.length) return message.reply("there is nothing in the shop!")
        items.sort((a, b) => b.cost - a.cost)

        let item = undefined
        if (isNaN(choice)) {
            item = await new MongoShop(message.guild.id).get({ name: args.slice(0).join(' ') })
            if (!item) return message.reply(`**${args[0]}** is an invalid number`)
        }
        else {
            choice = Math.floor(args[0])
            if (choice > items.length) return message.reply(`the item-number starts at **1** and ends at **${items.length}. You can get the item-number from \`${message.client.config.prefix}shop`)
            item = items[choice - 1]
        }
        const { roleId, cost } = item

        const data = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (data.wallet < cost) return message.reply(`you need **${message.client.config.economy.symbol.front}${cost - data.wallet}${message.client.config.economy.symbol.back}** more to purchase this role`)
        if (message.member.roles.cache.has(roleId)) return message.reply(`you already have this role!`)

        const embed = new MessageEmbed()
        message.member.roles.add(roleId)
        new MongoEconomy(message.guild.id, message.author.id).add({ amount: -cost, type: 'wallet' })
        return message.reply(embed.setDescription(`You bought **${item.name.length ? item.name : `the <@&${roleId}> role!`}**!`))
    }
}
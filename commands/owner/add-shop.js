const { MessageEmbed } = require("discord.js")
const { MongoShop } = require("../../library/guild")
module.exports = {
    name: 'add-shop',
    aliases: ['addshop', 'shop-add', 'shopadd'],
    description: "Adds a role to the shop",
    ownerOnly: true,
    minArgs: 2,
    expectedArgs: '<@&role/id> <price> <description>',
    category: 'owner',
    run: async function (message, args) {
        const embed = new MessageEmbed()
        if (args[0].startsWith('<@&') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const role = message.guild.roles.cache.find(r => [r.id, r.name].includes(args[0]))
        if (!role) return message.reply(`**${args[0]}** is an invalid role`)

        const data = await new MongoShop(message.guild.id).get({ roleId: role.id })
        if (data) return message.reply(embed.setDescription(`${role} is already being sold on the shop for [\`${message.client.config.economy.symbol.front}${data.cost}${message.client.config.economy.symbol.back}\`](https://discord.com)\n\nYou can instead edit the price of this role with \`${message.client.config.prefix}edit-role ${role.id} <number>\``))

        const amount = Math.floor(args[1])
        if (isNaN(amount)) return message.reply(`**${args[1]}** is an invalid number`)
        if (amount < 0) return message.reply(`I need to earn something from selling this role!`)
        
        const description = args.slice(2).join(' ') || "Buy me!"
        
        message.channel.send("Type out the name of this item. If you'd like members to just buy it by order-number, type \`null\`")
        let name = ''
        const filter = m => m.author.id == message.author.id
        const collection = await message.channel.awaitMessages(filter, { max : 1, time: 60000 })
        if (collection.size) {
            const { content } = collection.first()
            if (content.toLowerCase() !== 'null') name = content
        }
        if (name.length) {
            const hasName = await new MongoShop(message.guild.id).get({ name: name })
            if (hasName) return message.reply(`there already an item with the name **${name}**!`)
        }

        new MongoShop(message.guild.id).add({ roleId: role.id, cost: amount, description: description, name: name })
        return message.reply(embed.setDescription(`${role} has been added to the shop, it will be sold for [\`${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}\`](https://discord.com)`))
    }
}
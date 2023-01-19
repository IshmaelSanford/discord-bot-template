const { MessageEmbed } = require("discord.js")
const { MongoShop } = require("../../library/guild")
module.exports = {
    name: 'delete-shop',
    aliases: ['deleteshop', 'remove-shop', 'removeshop', 'shop-delete', 'shopdelete', 'shop-remove', 'shopremove'],
    description: "Removes a role from the shop",
    ownerOnly: true,
    minArgs: 1,
    expectedArgs: '<@&role/id>',
    category: 'owner',
    run: async function (message, args) {
        const embed = new MessageEmbed()
        if (args[0].startsWith('<@&') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const role = message.guild.roles.cache.find(r => [r.id, r.name].includes(args[0]))
        if (!role) return message.reply(`**${args[0]}** is an invalid role`)

        const data = await new MongoShop(message.guild.id).get({ roleId: role.id })
        if (!data) return message.reply(embed.setDescription(`${role} is not being sold on the shop`))

        new MongoShop().delete(message.guild.id, role.id)
        return message.reply(embed.setDescription(`${role} has been removed from the shop, it will no longer be sold`))
    }
}
const { MessageEmbed } = require("discord.js")
const { MongoShop } = require("../../library/guild")
module.exports = {
    name: 'edit-name',
    aliases: ['editname'],
    description: "Edits a role in the shop",
    ownerOnly: true,
    minArgs: 2,
    expectedArgs: '<@&role/id> <description>',
    category: 'owner',
    run: async function (message, args) {
        const embed = new MessageEmbed()
        if (args[0].startsWith('<@&') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const role = message.guild.roles.cache.find(r => [r.id, r.name].includes(args[0]))
        if (!role) return message.reply(`**${args[0]}** is an invalid role`)

        const data = await new MongoShop(message.guild.id).get({ roleId: role.id })
        if (!data) return message.reply(embed.setDescription(`${role} is not being sold on the shop`))

        let name = args.slice(0).join(' ')
        if (name.toLowerCase() == 'null') name = ''
        if (name.length) {
            const hasName = await new MongoShop(message.guild.id).get({ name: name })
            if (hasName) return message.reply(`there already an item with the name **${name}**!`)
        }

        new MongoShop(message.guild.id).update({ roleId: role.id, property: 'name', value: name })
        return message.reply(embed.setDescription(`${role}'s name has been updated, its name will now be **${name}**`))
    }
}
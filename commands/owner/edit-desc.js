const { MessageEmbed } = require("discord.js")
const { MongoShop } = require("../../library/guild")
module.exports = {
    name: 'edit-description',
    aliases: ['editdescription', 'edit-desc', 'editdesc'],
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

        let description = args.slice(0).join(' ')
        if (description.toLowerCase() == 'null') description = ''

        new MongoShop(message.guild.id).update({ roleId: role.id, property: 'description', value: description })
        return message.reply(embed.setDescription(`${role}'s description has been updated, its description will now be **${description}**`))
    }
}
const { MessageEmbed } = require('discord.js')
const {MongoGuild} = require('../../library/guild')
module.exports = {
    name: 'delete-verify',
    aliases: ['deleteverify', 'remove-verify', 'removeverify'],
    minArgs: 1,
    expectedArgs: '<@&role/id>',
    description: "Removes a verification role that was originally supposed to be given when using the verify command",
    ownerOnly: true,
    category: 'owner',
    run: async function(message, args) {
        if (args[0].startsWith('<@&') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const role = message.guild.roles.cache.find(r => [r.id, r.name].includes(args[0]))
        if (!role) return message.reply(`**${args[0]}** is an invalid role`)

        if (!message.guild.database.verifyIds.includes(role.id)) return message.reply(new MessageEmbed().setDescription(`${role} wasn't a verification role to begin with`))
        message.guild.database = await new MongoGuild(message.guild.id).update({ property: 'verifyIds', type: 'pull', value: role.id })
        return message.reply(new MessageEmbed().setDescription(`Members will no longer get the ${role} role when they use the \`${message.client.config.prefix}verify\` command`))
    }
}
const { MessageEmbed } = require('discord.js')
const {MongoGuild} = require('../../library/guild')
module.exports = {
    name: 'add-verify',
    aliases: ['addverify'],
    minArgs: 1,
    expectedArgs: '<@&role/id>',
    description: "Adds a verification role that will be given when using the verify command",
    ownerOnly: true,
    category: 'owner',
    run: async function(message, args) {
        if (args[0].startsWith('<@&') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const role = message.guild.roles.cache.find(r => [r.id, r.name].includes(args[0]))
        if (!role) return message.reply(`**${args[0]}** is an invalid role`)

        if (message.guild.database.verifyIds.includes(role.id)) return message.reply(new MessageEmbed().setDescription(`${role} is already a verification role that will be given to members`))
        message.guild.database = await new MongoGuild(message.guild.id).update({ property: 'verifyIds', type: 'push', value: role.id })
        return message.reply(new MessageEmbed().setDescription(`Members will now get the ${role} role when they use the \`${message.client.config.prefix}verify\` command`))
    }
}
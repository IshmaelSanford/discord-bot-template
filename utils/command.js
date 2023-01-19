const { MessageEmbed } = require('discord.js')
const rand = require('random')
const { MongoGuild } = require('../library/guild')
module.exports = async function (client, message) {
    const {
        author,
        member,
        content,
        channel,
        guild
    } = message
    if (author.bot) return

    const { prefix: prefixes } = client.config
    let prefix = prefixes[0]
    if (!content.startsWith(prefix)) {
        if (!content.startsWith(prefixes[1])) return
        else prefix = prefixes[1]
    }

    const arguments = content.substr(content.indexOf(prefix) + prefix.length).split(new RegExp(/\s+/))
    const name = arguments.shift().toLowerCase()
    const command = await client.commands.get(name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name))
    if (!command) return
    const embed = new MessageEmbed()
        .setFooter(`${message.client.config.server.name} Bot`)
        .setAuthor(`${client.user.username} Helper`, client.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setTitle(`Command: ${command.name}`)
        .setDescription(`${command.description ? command.description : 'No description provided'}`)

    let {
        permissions,
        clientPermissions,
        ownerOnly,
        clientOnly,
        minArgs,
        maxArgs,
        expectedArgs,
        dmAllowed,
        hidden
    } = command

    if (!guild) {
        // Are DMs allowed?
        if (!dmAllowed) return
    }
    if (guild) {
        let hasPerm = true
        const noPermMessages = [
            "You can't do that!",
            "You can't use that!",
            "You can't use those!",
            "These commands aren't for you!",
            "You don't have permissions to use that command!"
        ]
        // Guild Owner
        if (ownerOnly && member.id !== guild.ownerID) hasPerm = false
        // If permissions are required
        if (permissions) {
            if (typeof permissions == 'string') permissions = [permissions]
            for (const permission of permissions) if (!member.permissions.has(permission)) hasPerm = false
        }
        // If client permissions are required
        if (clientPermissions) {
            const missingPermissions = []
            if (typeof clientPermissions == 'string') clientPermissions = [clientPermissions]
            for (const permission of clientPermissions) if (!guild.me.permissions.has(permission)) missingPermissions.push(`\`${permission}\``)
            if (missingPermissions.length) return channel.send(member, embed.setDescription(`I am missing the following permissions: ${missingPermissions.join(', ')}`))
        }
        if (!hasPerm) return channel.send(noPermMessages[rand.int(0, noPermMessages.length - 1)])
        if (!guild.database) guild.database = await new MongoGuild(guild.id).get()
    }
    // Client Owner 
    if (clientOnly) {
        const { owner } = await client.fetchApplication()
        if (owner.id !== author.id) return
    }

    // Arguments
    if (minArgs && arguments.length < minArgs || maxArgs && arguments.length > maxArgs)
        return channel.send(member, embed.setDescription(`**Arguments**\n\`${prefix}${name} ${expectedArgs}\``))
    command.run(message, arguments)
}
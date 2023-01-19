module.exports = {
    name: 'lock',
    ownerOnly: true,
    description: "Locks a channel",
    category: 'owner',
    run: async function(message, args) {
        let channel = message.channel
        if (args.length) {
            if (args[0].startsWith('<#') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
            channel = message.guild.channels.cache.find(c => [c.id, c.name].includes(args[0]))
            if (!channel) channel = message.channel
        }
        const data = message.client.lock.get(channel.id)
        if (data) return message.reply(`${channel} is already locked`)

        const permissionOverwrites = channel.permissionOverwrites.array()
        message.client.lock.set(channel.id, permissionOverwrites)

        const newOverwrites = []
        for (i = 0; i < permissionOverwrites.length; i++) {
            const overwrite = permissionOverwrites[i]
            const allow = overwrite.allow.toArray().filter(p => !['SEND_MESSAGES', 'CONNECT'].includes(p))
            const deny = overwrite.deny.toArray()
            deny.push('SEND_MESSAGES', 'CONNECT')
            newOverwrites.push({ id: overwrite.id, allow, deny })
        }
        await channel.overwritePermissions(newOverwrites)
        return message.reply(`${channel} has been locked`)
    }
}
module.exports = {
    name: 'unlock',
    ownerOnly: true,
    description: "Unlocks a channel",
    category: 'owner',
    run: async function(message, args) {
        let channel = message.channel
        if (args.length) {
            if (args[0].startsWith('<#') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
            channel = message.guild.channels.cache.find(c => [c.id, c.name].includes(args[0]))
            if (!channel) channel = message.channel
        }
        const permissionOverwrites = message.client.lock.get(channel.id)
        if (!permissionOverwrites) return message.reply(`${channel} is already unlocked`)

        const newOverwrites = []
        for (const overwrite of permissionOverwrites) {
            const { id } = overwrite
            if (message.guild.roles.cache.get(id) || await message.guild.members.fetch(id).catch(()=>{return})) newOverwrites.push(overwrite)
        }
        message.client.lock.delete(channel.id)
        await channel.overwritePermissions(newOverwrites)
        return message.reply(`${channel} has been unlocked`)
    }
}
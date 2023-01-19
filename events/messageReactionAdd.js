console.log("event triggered")
const getEmoji = require('discordmoji')
const MongoReaction = require('../library/MongoReaction')
module.exports = async function(client, reaction, user) {
    if (user.bot) return
    if (!reaction.message.guild) return
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()

    const { message, emoji } = reaction
    const emote = getEmoji(client, emoji)

    const mongo = new MongoReaction(message.guild.id)
    const data = await mongo.getBy.message(message.id, emote.id ? emote.id : emote)
    if (!data) return

    const member = await message.guild.members.fetch(user).catch(() => { return })
    const roles = member.roles.cache.map(r => r.id)
    for (i = 0; i < data.length; i++) {
        const { roleId } = data[i]
        const role = message.guild.roles.cache.get(roleId)
        if (!role) await new mongo.delete(message.id, message.channel.id, emote.id ? emote.id : emote, roleId)
        else if (!roles.includes(role.id)) roles.push(role.id)
    }
    member.roles.set(roles)
}   
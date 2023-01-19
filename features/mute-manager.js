const { MongoMute } = require('../library/guild')
async function muteManager(client) {
    const muteDatas = (await new MongoMute().getMuteData({ all: true })).filter(data => Date.now() > data.end)
    for (const muteData of muteDatas) {
        const { guildId, userId } = muteData
        const guild = client.guilds.cache.get(guildId)
        if (!guild) new MongoMute(guildId).unmute(guildId, userId)
        else {
            if (!guild.database) guild.database = await new MongoMute(guild.id).getGuildData()
            const role = guild.roles.cache.get(guild.database.muteId)
            if (!role) new MongoMute(guildId).unmute(guildId, userId)
            else {
                const member = await guild.members.fetch(userId).catch(()=>{return})
                if (member && member.roles.cache.has(role.id)) member.roles.remove(role.id)
                new MongoMute(guildId).unmute(guild.id, member.id)
            }
        }
    }
    setTimeout(() => muteManager(client), 60000)
}
module.exports = async function(client) {
    muteManager(client)
}
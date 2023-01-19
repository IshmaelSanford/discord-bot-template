const ms = require('ms')
async function count(client) {
    const channel = client.channels.cache.get(client.config.memberCounterID)
    if (!channel) return
    channel.setName(`Members: ${channel.guild.memberCount}`)
    setTimeout(() => count(client), ms('5m'))
}
module.exports = async function(client) {
    count(client)
}
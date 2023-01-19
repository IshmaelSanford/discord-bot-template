const { MongoEconomy } = require("../../library/user")

module.exports = {
    name: 'leavemafia',
    aliases: ['leave'],
    description: "leave the mafia",
    category: 'mafia',
    run: async function(message) {
        const data = await new MongoEconomy(message.guild.id, message.author.id).get()
        if (!data.mafia) return message.reply(`you weren't part of the mafia to begin with.`)
        
        const roleIds = []
        for (const cost in message.client.config.mafia) for (const property in message.client.config.mafia[cost]) {
            roleIds.push(message.client.config.mafia[cost][property])
        }

        new MongoEconomy(message.guild.id, message.author.id).set({ amount: false, type: 'mafia' })
        message.member.roles.remove(roleIds)
        return message.reply(`you left the **Mafia**.`)
    }
}
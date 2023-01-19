const { MongoEconomy } = require("../../library/user")

module.exports = {
    name: 'attack',
    description: "Call a hit on a member, mentioning every mafia member",
    minArgs: 1,
    expectedArgs: '<@member/id>',
    category: 'mafia',
    run: async function(message, args) {
        const datas = (await new MongoEconomy(message.guild.id, message.author.id).get(true)).filter(data => data.mafia)
        datas.sort((a, b) => b.wallet - a.wallet)
        isAllowed = false
        for (let i = 0; i < 4; i++) if (datas[i].usearId == message.author.id) isAllowed = true
        if (!isAllowed) return message.reply(`you're not the Godfather or a Ringholder.`)

        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(()=>{return})
        if (!member) return message.reply(`**${args[0]}** is not an existing member.`)

        const { roleId } = message.client.config.mafia[700000]
        message.channel.send(`<@&${roleId}>\nA ringholder/godfatehr has just requested   a hit on ${member}!`)
    }
}
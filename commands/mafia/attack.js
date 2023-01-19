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
        if (datas[0].userId !== message.author.id) return message.reply(`you're not the Godfather.`)

        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.guild.members.fetch(args[0]).catch(()=>{return})
        if (!member) return message.reply(`**${args[0]}** is not an existing member.`)

        const roleIds = []
        for (const property in message.client.config.mafia) roleIds.push(`<@&${message.client.config.mafia[property].roleId}>`)

        message.channel.send(`${roleIds.join(' ')}\nThe godfather has just called a hit on ${member}!`)
    }
}
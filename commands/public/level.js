const { MessageEmbed } = require("discord.js")
const { MongoLevel } = require("../../library/user")

module.exports = {
    name: 'level',
    aliases: ['rank', 'lvl'],
    run: async function(message, args) {
        let member = message.member
        if (args.length) {
            if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
            member = await message.guild.members.fetch(args[0]).catch(()=>{return})
            if (!member) member = message.member
        }
        const mongo = new MongoLevel(message.guild.id, member.id)
        const data = await mongo.get()
        const needed = message.client.config.xp.base + (data.level * message.client.config.xp.multiplier)

        const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
        .addField("Level", data.level)
        .addField("XP", `${data.xp}/${needed}`)
        message.channel.send(embed)
    }
}
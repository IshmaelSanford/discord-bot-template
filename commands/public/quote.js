const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'quote',
    description: "Quote someone",
    minArgs: 2,
    expectedArgs: '<@member/id> <quote>',
    category: 'misc',
    run: async function(message, args) {
        if (!message.client.config.channels.quote.includes(message.channel.id)) return
        if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
        const member = await message.client.users.fetch(args[0]).catch(()=>{return})
        if (!member) return message.reply(`**${args[0]}** is an invalid user`)

        // check if message doesn't contain keyword 'quote'
        //doesnt currently work --- need to fix
        if (!message.content.includes(",quote")) {
            message.delete()
            return
        }

        const quote = args.slice(1).join(' ')
        const embed = new MessageEmbed()
        .setAuthor(member.tag, member.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(`"${quote}"`)
        .setFooter(`${message.client.config.server.name} Bot`)
        message.channel.send(embed)
        message.delete() // delete the quote message
    }
}
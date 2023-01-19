const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    description: "Displays member's avatar",
    category: 'misc',
    run: async function(message, args) {
        let user = message.author
        if (args.length) {
            if (args[0].startsWith('<@') && args[0].endsWith('>')) args[0] = args[0].replace(/\D/g, '')
            user = await message.client.users.fetch(args[0]).catch(() => { return })
            if (!user) user = message.author
        }

        const embed = new MessageEmbed()
        .setTitle(`${user.tag}'s avatar`)
        .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 }))
        .setFooter(`${message.client.config.server.name} Bot`)
        message.channel.send(embed)
    }
}
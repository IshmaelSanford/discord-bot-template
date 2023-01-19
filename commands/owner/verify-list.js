const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'verify-list',
    aliases: ['verifylist'],
    description: "Shows a list of verification roles",
    category: 'owner',
    ownerOnly: true,
    run: async function(message, args) {
        const verifyRoleIds = message.guild.database.verifyIds.filter(r => message.guild.roles.cache.get(r))
        const embed = new MessageEmbed()
        .setDescription(`These are the roles that new members will get when they verify: ${verifyRoleIds.map(r => `<@&${r}>`).join(', ')}`)
        message.channel.send(embed)
    }
}
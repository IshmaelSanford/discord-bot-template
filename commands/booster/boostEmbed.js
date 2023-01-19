const Discord = require('discord.js');

module.exports = {
    name: "boosted",
    aliases: ['boost'],
    description: "Sends a message in general when someone boosts the server",
    run: async function (message) {
        if (!message.member.roles.cache.find(r => r.name === "rich")) return;
        const embed = new Discord.MessageEmbed()
            .setColor("#FF69B4")
            .setAuthor(`${message.client.config.server.name} Bot`, 'https://cdn3.emoji.gg/emojis/6494-discord-boost.gif')
            .setTitle(`Thanks for boosting ${message.client.config.server.name}`)
            .setDescription(`You can now make a booster role! Use these commands to get started:`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
            .addField(" ", '```\nSteps:\n,br [hex] [name]\n,br icon [emoji]\n,br rename [name]\n```')
            .setFooter(`rep ${message.client.config.server.name} by putting .gg/${message.client.config.server.name} in your status!`);
        message.channel.send(embed);
    }
}
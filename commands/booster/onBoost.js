const Discord = require('discord.js');
const client = new Discord.Client();

client.on("guildMemberUpdate", (oldMember, newMember) => {
    // check if the user has added the boost role
    if (newMember.roles.cache.has("DISCORD_GUILD_MEMBER_PREMIUM_GUILD_TIER_1") && !oldMember.roles.cache.has("DISCORD_GUILD_MEMBER_PREMIUM_GUILD_TIER_1")) {
        // Send the embed message
        const embed = new Discord.MessageEmbed()
            .setColor("#FF69B4")
            .setAuthor(`${message.client.config.server.name} Bot`, 'https://cdn3.emoji.gg/emojis/6494-discord-boost.gif')
            .setTitle(`Thanks for boosting ${message.client.config.server.name}`)
            .setDescription(`You can now make a booster role! Use these commands to get started:`)
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, format: 'png' }))
            .addField(" ", '```\nSteps:\n,br [hex] [name]\n,br icon [emoji]\n,br rename [name]\n```')
            .setFooter(`rep ${message.client.config.server.name} by putting .gg/${message.client.config.server.name} in your status!`);
        const general = message.client.config.channels.boost;
        if (!general) return message.channel.send("Could not find general channel.");
        general.send(embed);
    }
});
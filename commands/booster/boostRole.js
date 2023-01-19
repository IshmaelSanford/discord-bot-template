const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "boostrole",
    aliases: ['br'],
    description: "Get your own custom booster color role",
    minArgs: 2,
    expectedArgs: '<#hexcolor> <role-name>',
    category: "misc",
    run: async (message, args) => {
        if (!message.member.roles.cache.find(r => r.id === message.client.config.server.boostRole[0])) return message.channel.send("You don't have the necessary permissions to use this command.");
        let color = args[0];
        let roleName = args.slice(1).join(" ");
        /*if (!Discord.Util.resolveColor(color)) return message.channel.send("Invalid hex color.");*/
        
        // Create the role
        console.log('role created')
        message.guild.roles.create({
            data: {
                name: roleName,
                color: color,
                permissions: []
            }
        }).then(async role => {
            // Assign the role to the user
            role.setPosition(message.guild.roles.highest.position - 1);
            message.member.roles.add(role)
            role.setPosition(message.guild.roles.cache.size -1);
            // Ask the user to use the "icon" sub command to set an emoji as the role's icon
            const embed = new Discord.MessageEmbed()
                .setColor("#d99e82")
                .setDescription(`🎨${message.author}: Cool, you were assigned the role **${role.name}** with the color \`#${color}\``);
            const icon = new Discord.MessageEmbed()
                .setDescription(`Please use the \`,br icon <emoji>\` command to set an icon for your new role!`)
            message.channel.send(embed);
            message.channel.send(icon);
        }).catch(console.error);
    },
    subcommands: {
        icon: {
            description: "Add an icon to your custom role",
            minArgs: 1,
            expectedArgs: "<emoji>",
            run: async (message, args, roleName) => {
                let emoji = args[0];
                if(emoji.startsWith("<:")){
                    let id = emoji.split(':')[2].slice(0,-1);
                    let url = `https://cdn.discordapp.com/emojis/${id}.png`;
                    try {
                    // Find the role created by the user
                    const role = await message.member.roles.cache.find(r => r.name === roleName);
                    if (!role) return message.channel.send("You don't have a custom role to add an icon to.");
                    // Use fetch to get the image of the emoji
                    const emojiBuffer = await fetch(url).then(res => res.buffer());
                    // Set the role's icon
                    role.setIcon(emojiBuffer, { reason: "Adding role icon" });
                    const success = new Discord.MessageEmbed()
                        .setColor("#76B947")
                        .setDescription(`✔️${message.author}: Updated your **booster role icon** to ${emoji}`);
                    return message.channel.send(success);
                    } catch (error) {
                    console.error(error);
                    return message.channel.send("There was an error adding the icon. Please try again or contact support.");
                    }
                }
            }
        },
        rename: {
            description: "Rename your custom role",
            minArgs: 1,
            expectedArgs: "<new-role-name>",
            run: async (message, args, roleName) => {
                let newName = args.join(" ");
                try {
                    const role = await message.member.roles.cache.find(r => r.name === roleName);
                    if (!role) return message.channel.send("You don't have a custom role to rename.");
                    role.setName(newName);
                    const success = new Discord.MessageEmbed()
                        .setColor("#76B947")
                        .setDescription(`✔️${message.author}: Updated your **booster role name** to ${newName}`);
                    return message.channel.send(success);
                } catch (error) {
                    console.error(error);
                    return message.channel.send("There was an error renaming the role. Please try again or contact support.");
                }
            }
        }
    }
}
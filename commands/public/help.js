const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'help',
    description: "Lists all the commands",
    run: async function (message, args) {

        let command
        if (args.length) command = message.client.commands.get(args[0]) || message.client.commands.find(function(cmd) {
            aliases = cmd.aliases || []
            return aliases.includes(args[0])
        })
        if (command) {
            /*if (command.ownerOnly && message.author.id !== message.guild.ownerID) command = undefined
            if (command && command.permissions) {
                if (typeof command.permissions == 'string') command.permissions = [command.permissions]
                for (const permission of command.permissions) if (!message.member.permissions.has(permission)) command = undefined
            }*/
            if (command) {
                const embed = new MessageEmbed()
                .setTitle(`${message.client.config.prefix[0]}${command.name} ${command.expectedArgs ? ` ${command.expectedArgs}` : ''}${command.aliases ? ` [${command.aliases.join(' ')}]` : ''}`)
                .setDescription(`${command.description ? command.description : 'No description provided'}`)
                message.channel.send(embed)
            }
        }

        if (!command) {
            const embed = new MessageEmbed()
            .setDescription(`Prefixes: ${message.client.config.prefix.map(p => `\`${p}\``).join(' ')}\nTo get more information of a particular command, type \`${message.client.config.prefix[0]}${this.name} [command]\``)
            const categories = []
            const cmds = message.client.commands.array()
            for (const command of cmds) if (command.category && !categories.includes(command.category)) categories.push(command.category)
            for (const category of categories) {
                const commands = cmds.filter(function (cmd) {
                    return cmd.category == category
                    /*let isOwner = true
                    let hasPerm = true
                    if (cmd.ownerOnly && message.author.id !== message.guild.ownerID) isOwner = false
                    if (cmd.permissions) {
                        if (typeof cmd.permissions == 'string') cmd.permissions = [cmd.permissions]
                        for (const permission of cmd.permissions) if (!message.member.permissions.has(permission)) hasPerm = false
                    }
                    return isOwner && hasPerm && cmd.category == category*/
                });
                if (commands.length) embed.addField(category.toUpperCase(), commands.map(command => `[\`${command.name}\`](https://discord.gg/habits.com)`).join(' '), true) 
            .setFooter(`${message.client.config.server.name} Bot`)
            }
            message.channel.send(embed)
        }
    }
}
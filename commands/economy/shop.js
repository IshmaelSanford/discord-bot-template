const chunkify = require('chunk-array').chunks
const { MongoShop } = require('../../library/guild')
const { MongoEconomy } = require('../../library/user')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'shop',
    description: "Displays the shop",
    category: 'economy',
    run: async function(message, args) {
        const embed = new MessageEmbed().setTitle("Bazzar")
        const data = await new MongoEconomy(message.guild.id, message.author.id).get()

        const description = `Example \`${message.client.config.prefix}buy 1\`\n*(Please react with the ◀️ ▶️ to change the page number)*`

        const items = (await new MongoShop(message.guild.id).get({ guild: true })).filter(item => message.guild.roles.cache.get(item.roleId))
        if (!items.length) return message.reply(embed.setDescription("There is nothing in the shop!"))
        
        const shopItems = items.filter(item => item.name.length)
        shopItems.sort((a, b) => b.cost - a.cost)
        for (i = 0; i < shopItems.length; i++) shopItems.splice(i, 1, `\`${shopItems[i].name}\` • **${message.client.config.economy.symbol.front}${shopItems[i].cost}${message.client.config.economy.symbol.front}**\n${shopItems[i].description || 'Buy me!'}`)

        const namedItems = items.filter(item => !item.name.length)
        namedItems.sort((a, b) => b.cost - a.cost)
        for (i = 0; i < namedItems.length; i++) shopItems.push(`\`${i + 1}\` • <@&${namedItems[i].roleId}> • **${message.client.config.economy.symbol.front}${namedItems[i].cost}${message.client.config.economy.symbol.front}**\n${namedItems[i].description || 'Buy me!'}`)

        const pages = chunkify(shopItems, 7)
        let current = 1, max = pages.length
        const msg = await message.reply(embed.setDescription(`${description}\n\n${pages[current-1].join('\n\n')}`).setFooter(`Page ${current}/${max}`))
        if (max > 1) {
            const emojis = ['◀️', '▶️']
            emojis.forEach(e => msg.react(e))

            const filter = (r, u) => emojis.includes(r.emoji.name) && u.id == message.author.id
            const collector = msg.createReactionCollector(filter, { time: 180000 })
            collector.on('collect', function(r, u) {
                r.users.remove(u)
                if (r.emoji.name == '◀️' && current > 1) {
                    current--
                    msg.edit(embed.setDescription(`${description}\n\n${pages[current-1].join('\n\n')}`).setFooter(`Page ${current}/${max}`))
                } 
                if (r.emoji.name == '▶️' && current < max) {
                    current++
                    msg.edit(embed.setDescription(`${description}\n\n${pages[current-1].join('\n\n')}`).setFooter(`Page ${current}/${max}`))
                } 
            })
        }
    }
}
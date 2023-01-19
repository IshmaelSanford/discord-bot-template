const { MessageEmbed } = require('discord.js')
const { MongoEconomy } = require('../../library/user')
module.exports = {
    name: 'capstop',
    aliases: ['top'],
    description: "lists the top 10 richest members",
    category: 'economy',
    run: async function (message) {
        const datas = await (await new MongoEconomy(message.guild.id).get(true)).filter(d => message.guild.members.fetch(d.userId).catch(() => { return }) && d.wallet > 0)
        datas.sort((a, b) => b.wallet - a.wallet)
        const top = datas.slice(0, 10)
        for (let i = 0; i < top.length; i++) top.splice(i, 1, `\`${i + 1}\` ・ <@${top[i].userId}> | **${message.client.config.economy.symbol.front}${top[i].wallet}${message.client.config.economy.symbol.back}**`)

        const embed = new MessageEmbed()
            .setFooter('Kodama Bot')
            .setTitle("Caps Leaderboard")
            .setDescription(`\`❗\` Sweats only \`❗\`\n\n${top.join('\n\n')}`)
        message.channel.send(embed)
    }
}
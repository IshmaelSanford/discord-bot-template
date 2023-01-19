const humanize = require('humanize-duration')
const cooldowns = new Map()
const ms = require('ms')
module.exports = {
    name: 'echo',
    description: "Echos exactly what you say",
    category: 'misc',
    run: async function(message, args) {
        //cooldown
        const cooldown = cooldowns.get(message.author.id)
        if (Date.now() < cooldown) {
            const remaining = cooldown - Date.now()
            message.reply(`⏰ Please wait for **${humanize(remaining, { largest: 1, round: true })}** before trying to \`${this.name}\` again`)
            message.react("⏰") // add a reaction of a clock emoji
            return 
        }
        cooldowns.set(message.author.id, Date.now() + ms('1h'))
        setTimeout(() => cooldowns.delete(message.author.id), ms('1h'))

        message.channel.send(args.join(' '))
    }
}
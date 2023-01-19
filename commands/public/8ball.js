const axios = require('axios')
const humanize = require('humanize-duration')
const cooldowns = new Map()
module.exports = {
    name: '8ball',
    aliases: ['8b'],
    description: "Magic 8Ball",
    minArgs: 1,
    expectedArgs: "<question>",
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
        cooldowns.set(message.author.id, Date.now() + 3000)
        setTimeout(() => cooldowns.delete(message.author.id), 3000)

        const errorMessage = [
            "It is certain",
            "It is decidedly so",
            "Without a doubt",
            "Yes, definitely!",
            "You may rely on it",
            "As I see it",
            "yes now bug off",
            "Most Likely",
            "Outlook good",
            "Yes",
            "Yes. Is that it?",
            "Signs point to yes"
        ];
        try {
            const { data } = await axios.get(`https://8ball.delegator.com/magic/JSON/${encodeURIComponent(args.slice(0).join(' '))}`)
            message.channel.send(data.magic.answer)
        } catch (error) {
            const randomIndex = Math.floor(Math.random() * errorMessage.length)
            message.channel.send(`> \`🎱\` ${errorMessage[randomIndex]}`)
        }
    }
}
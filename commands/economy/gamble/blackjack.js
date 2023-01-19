const { MessageEmbed } = require('discord.js')
const { MongoEconomy } = require('../../../library/user')
module.exports = {
    name: 'blackjack',
    aliases: ['bj'],
    minArgs: 1,
    expectedArgs: '<amount>',
    description: "A game of Blackjack",
    category: 'gambling',
    run: async function (message, args, config) {
        const { channel, author, guild } = message
        const embed = new MessageEmbed().setColor("BLUE")

        const mongo = new MongoEconomy(message.guild.id, message.author.id)
        const data = await mongo.get()

        const { wallet } = data

        let amount = Math.floor(args[0])
        if (isNaN(amount)) return message.reply(`**${args[0]}** is an invalid number`)
        if (amount < 1) return message.reply(`you can't bet nothing.`)
        if (amount > wallet) return message.reply(`you only have **${message.client.config.economy.symbol.front}${wallet}${message.client.config.economy.symbol.back}** in your balance`)
        await mongo.add({ amount: -amount, type: 'wallet' })

        const deck = getDeck()
        const pFirst = getCard(deck)
        const dFirst = getCard(deck)
        const pSecond = getCard(deck)
        const dSecond = getCard(deck) 

        const pValue = pFirst.value + pSecond.value
        let pSoft = false
        if (pFirst.isAce || pSecond.isAce) pSoft = true
        const player = new Player(pValue, [pFirst, pSecond], pSoft)

        const dValue = dFirst.value + dSecond.value
        let dSoft = false
        if (dFirst.isAce || dSecond.isAce) dSoft = true
        const dealer = new Player(dValue, [dFirst, dSecond], dSoft)

        let soft_value
        if (player.isSoft) {
            soft_value = player.value - 11 + 1
            if (soft_value > 21) player.isSoft = false
            else player.soft_value = soft_value
        }

        let playerString = `${player.hand.map(c => c.name).join(' ')}\nValue: ${player.value}`
        if (player.isSoft) playerString = `${player.hand.map(c => c.name).join(' ')}\nValue: Soft ${player.value}`
        let dealerString = `${dFirst.name} \`?\`\nValue: ${dFirst.value}`

        embed
            .setDescription(`**GOAL |** To not exceed 21 and have a higher value than the Dealer's Hand\n\nType \`hit\` to draw another card.\nType \`stand\` to stop drawing cards and switch to dealer's turn.`)
            .addField('Player Hand', playerString, true).addField('Dealer Hand', dealerString, true).setFooter(`Bet ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`)

        // if dealer's first card is a value 10
        if (dFirst.value == 10) {
            // if dealer got blackjack
            if (dSecond.isAce) {
                dealerString = `${dealer.hand.map(c => c.name).join(' ')}\n${dealer.value}`
                embed.setColor('ORANGE').spliceFields(1, 1, { name: 'Dealer Hand', value: dealerString, inline: true })
                // push back
                if (player.value == 21 || player.soft_value == 21) {
                    await mongo.add({ amount: amount, type: 'wallet'})
                    embed.setColor('ORANGE').setDescription(`**Nobody wins**\nPush back.`).setFooter(`Push back  ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`)
                    return channel.send(embed)
                }
                // lose
                embed.setColor('RED').setDescription("**Dealer Blackjack**\nDealer wins.").setFooter(`Lose  ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`)
                return channel.send(embed)
            }
        }
        // if blackjack
        if (player.value == 21 || player.soft_value == 21) {
            const winAmount = Math.floor(amount + (amount * 0.5))
            await mongo.add({ amount: winAmount, type: 'wallet' })
            embed.setColor('GREEN').setDescription("**Player Blackjack**\nPlayer wins.").setFooter(`Win  ${message.client.config.economy.symbol.front}${winAmount - amount}${message.client.config.economy.symbol.back}`)
            return channel.send(embed)
        }

        const filter = m => m.author.id == author.id
        const msg = await channel.send(author, embed)
        const collector = channel.createMessageCollector(filter, { time: 600000 })
        collector.on('collect', async function (m) {
            const content = m.content.toLowerCase()
            if (content == 'hit') {
                const card = getCard(deck)
                player.hand.push(card)
                player.value = card.value + player.value
                player.soft_value = card.value + player.soft_value
                playerString = `${player.hand.map(c => c.name).join(' ')}\nValue: ${player.value}`
                if (player.isSoft) playerString = `${player.hand.map(c => c.name).join(' ')}\nValue: Soft ${player.value}`
                embed.spliceFields(0, 1, { name: 'Player Hand', value: playerString, inline: true })
                // if blackjack
                if (player.value == 21) {
                    const winAmount = Math.floor(amount + (amount * 0.75))
                    embed.setColor('GREEN').setDescription('**Player Blackjack**\nPlayer wins.').setFooter(`Win ${message.client.config.economy.symbol.front}${winAmount - amount}${message.client.config.economy.symbol.back}`)
                    msg.edit(embed)
                    await mongo.add({ amount: winAmount, type: 'wallet' })
                    return collector.stop({ reason: 'win' })
                }
                if (player.value > 21) {
                    embed.setColor('RED').setDescription('**Player Bust**\nDealer wins.').setFooter(`Lose ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`)
                    msg.edit(embed)
                    return collector.stop({ reason: 'lose' })
                }
                msg.edit(embed)
            }
            if (content == 'stand') return collector.stop({ reason: 'stand' })
        })
        collector.on('end', async function (d, { reason }) {
            if (!reason) return channel.send({ embed: { color: 'RED', title: "You took too long" } })
            if (reason == 'stand') {
                while (dealer.value <= 16) {
                    const card = getCard(deck)
                    dealer.hand.push(card)
                    dealer.value = card.value + dealer.value
                }
                dealerString = `${dealer.hand.map(c => c.name).join(' ')}\nValue: ${dealer.value}`
                embed.spliceFields(1, 1, { name: 'Dealer Hand', value: dealerString, inline: true })
                if (dealer.value < 21) {
                    if (dealer.value > player.value) return msg.edit(embed.setColor('RED').setDescription('Dealer wins.').setFooter(`Lose ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`))
                    // win
                    if (dealer.value < player.value) {
                        const winAmount = Math.floor(amount + (amount * 0.5))
                        await mongo.add({ amount: winAmount, type: 'wallet' })
                        return msg.edit(embed.setColor('GREEN').setDescription('Player wins.').setFooter(`Win ${message.client.config.economy.symbol.front}${winAmount - amount}${message.client.config.economy.symbol.back}`))
                    }
                    if (dealer.value == player.value) {
                        await mongo.add({ amount: amount, type: 'wallet' })
                        return msg.edit(embed.setColor('ORANGE').setDescription('**Nobody wins**\nPush back.').setFooter(`Push back ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`))
                    }
                }
                if (dealer.value > 21) {
                    const winAmount = Math.floor(amount + (amount * 0.5))
                    await mongo.add({ amount: winAmount, type: 'wallet' })
                    return msg.edit(embed.setColor('GREEN').setDescription("**Dealer bust**\nPlayer wins.").setFooter(`Win ${message.client.config.economy.symbol.front}${winAmount - amount}${message.client.config.economy.symbol.back}`))
                }
                if (dealer.value == 21) return msg.edit(embed.setColor('RED').setDescription("**Dealer blackjack**\nDealer wins.").setFooter(`Lose ${message.client.config.economy.symbol.front}${amount}${message.client.config.economy.symbol.back}`))
            }

        })
    }
}
function getCard(deck) {
    const index = Math.floor(Math.random() * deck.length)
    return deck.splice(index, 1)[0]
}
function getDeck() {
    const deck = []
    createFamily(deck, '♠️')
    createFamily(deck, '♣️')
    createFamily(deck, '♦️')
    createFamily(deck, '♥️')
    return deck
}
function createFamily(deck, family) {
    for (i = 1; i <= 13; i++) {
        if (i == 1) deck.push(new Card(`[\`${family} A\`](https://discord.com)`, 11, true))
        if (i >= 2 && i <= 10) deck.push(new Card(`[\`${family} ${i}\`](https://discord.com)`, i))
        if (i >= 11) {
            if (i == 11) deck.push(new Card(`[\`${family} J\`](https://discord.com)`, 10))
            if (i == 12) deck.push(new Card(`[\`${family} Q\`](https://discord.com)`, 10))
            if (i == 13) deck.push(new Card(`[\`${family} K\`](https://discord.com)`, 10))
        }
    }
}
class Card {
    constructor(name, value, isAce) {
        this.name = name
        this.value = value
        this.isAce = isAce || false
    }
}
class Player {
    constructor(value, cards, isSoft) {
        this.value = value
        this.soft_value = null
        this.hand = cards
        this.isSoft = isSoft
    }
}
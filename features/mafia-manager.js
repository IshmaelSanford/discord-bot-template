const { MongoGuild } = require('../library/guild')
const { MongoEconomy } = require('../library/user')
async function manageMafia(client) {
    const guilds = client.guilds.cache.array()
    for (const guild of guilds) {
        const godFatherRole = guild.roles.cache.get(client.config.mafia[700000].top1roleId)
        const ringHolderRole = guild.roles.cache.get(client.config.mafia[700000].top3roleId)
        
        if (godFatherRole && ringHolderRole) {
            const guildData = await new MongoGuild(guild.id).get()
            const allEconomies = (await new MongoEconomy(guild.id).get(true)).filter(data => data.wallet >= 700000)
            allEconomies.sort((a, b) => b.wallet - a.wallet)
            let validEconomies = []
            for (const data of allEconomies) if (guild.members.fetch(data.userId).catch(()=>{return})) validEconomies.push(data)
            validEconomies = validEconomies.slice(0, 10)

            if (validEconomies.length) {
                const godFather = validEconomies[0].userId
                const ringHolders = []
                if (validEconomies[1]) ringHolders.push(validEconomies[1].userId)
                if (validEconomies[2]) ringHolders.push(validEconomies[2].userId)
                if (validEconomies[3]) ringHolders.push(validEconomies[3].userId)

                if (godFather !== guildData.godfather) {
                    new MongoGuild(guild.id).update({ property: 'godfather', type: 'set', value: godFather })
                    const member = await guild.members.fetch(godFather).catch(()=>{return})
                    if (member && !member.roles.cache.has(godFatherRole.id)) member.roles.add(godFatherRole)
                }
                
                const added = []
                const removed = []
                for (const ringholder of ringHolders) if (!guildData.ringholders.includes(ringholder)) added.push(ringholder)
                for (const oldRingHolder of guildData.ringholders) if (!ringHolders.includes(oldRingHolder)) removed.push(oldRingHolder)
                if (added.length || removed.length) {
                    for (const id of added) {
                        const member = await guild.members.fetch(id).catch(()=>{return})
                        if (member && !member.roles.cache.has(ringHolderRole.id)) member.roles.add(ringHolderRole)
                    }
                    for (const id of removed) {
                        const member = await guild.members.fetch(id).catch(()=>{return})
                        if (member && member.roles.cache.has(ringHolderRole.id)) member.roles.remove(ringHolderRole)
                    }
                    console.log(`new ring holders, ${added}`)
                    new MongoGuild(guild.id).update({ property: 'ringholders', value: ringHolders, type: 'set' })
                }
            }
        }
    }
    setTimeout(() => manageMafia(client), 60000)
}
module.exports = async function(client) {
    manageMafia(client)
}
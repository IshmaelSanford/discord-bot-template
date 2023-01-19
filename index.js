require('module-alias/register')
const mongo = require('./mongo')
const rand = require('random')

const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] })
client.config = require('./config')
client.commands = new Discord.Collection()
client.lock = new Discord.Collection()

const { registerEvents, registerCommands } = require('./utils/registry')
client.once('ready', async function() {
    console.log('\x1b[42mConnected to Discord')
    const statuses = ['Temtpation server', 'Follow the rules!', 'Enjoy your stay!', 'Always watching...']
    iterateStatus(client, statuses)

    await mongo().then(async () => console.log('Connected to Mongo\x1b[0m'))
    await registerEvents(client, '../events')
    await registerCommands(client, '../commands')
    require('./features/mute-manager')(client)
    require('./features/mafia-manager')(client)
    require('./features/member-count')(client)
})
function iterateStatus(client, statuses) {
    const status = statuses[rand.int(0, statuses.length)]
    client.user.setActivity(status, { type: 'PLAYING' })
    setTimeout(() => iterateStatus(client, statuses), 60000)
}

console.log(`\x1b[34m
    8888888b.  d8b                                       888      888888b.            888    
    888  "Y88b Y8P                                       888      888  "88b           888    
    888    888                                           888      888  .88P           888    
    888    888 888 .d8888b   .d8888b .d88b.  888d888 .d88888      8888888K.   .d88b.  888888 
    888    888 888 88K      d88P"   d88""88b 888P"  d88" 888      888  "Y88b d88""88b 888    
    888    888 888 "Y8888b. 888     888  888 888    888  888      888    888 888  888 888    
    888  .d88P 888      X88 Y88b.   Y88..88P 888    Y88b 888      888   d88P Y88..88P Y88b.  
    8888888P"  888  88888P'  "Y8888P "Y88P"  888     "Y88888      8888888P"   "Y88P"   "Y888 
                                                                                             
                                                                                             
                                                                                             
    \x1b[0m\x1b[1mCreated by shorty#9999
    
    \x1b[0m`)

client.login(client.config.token)
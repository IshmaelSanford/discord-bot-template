const mongoose = require('mongoose')
const string = { type: String, default: '' }
const schema = mongoose.Schema({
    guildId: string,
    messageId: string,
    channelId: string,
    emoteId: string,
    roleId: string
})
module.exports = mongoose.model('reaction roles', schema)
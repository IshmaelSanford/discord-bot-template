const mongoose = require('mongoose')
const str = { type: String, default: '' }
const num = { type: Number, default: 0 }
const schema = mongoose.Schema({
    guildId: str,
    userId: str,
    reason: str,
    end: num,
    timestamp: num
})
module.exports = mongoose.model('mute', schema)
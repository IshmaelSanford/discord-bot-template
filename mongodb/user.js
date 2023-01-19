const mongoose = require('mongoose')
const str = { type: String, default: '' }
const num = { type: Number, default: 0 }
const bool = { type: Boolean, default: false }
const schema = mongoose.Schema({
    guildId: str,
    userId: str,
    wallet: num,
    bank: num,
    mafia: bool,
    level: num,
    xp: num,
})
module.exports = mongoose.model('user', schema)
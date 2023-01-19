const mongoose = require('mongoose')
const str = { type: String, default: '' }
const num = { type: Number, default: 0 }
const arr = { type: Array }
const schema = mongoose.Schema({
    guildId: str,
    muteId: str,
    verifyIds: arr,
    godfather: str,
    ringholders: arr,
    blacklist: arr
})
module.exports = mongoose.model('guild', schema)
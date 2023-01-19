const mongoose = require('mongoose')
const str = { type: String, default: '' }
const num = { type: Number, default: 0 }
const schema = mongoose.Schema({
    guildId: str,
    roleId: str,
    cost: num,
    description: str,
    name: str,
})
module.exports = mongoose.model('shop', schema)
const schema = require('../../mongodb/user')
const mongo = require('../../mongo')
module.exports = class MongoLevel {
    constructor(guildId, userId) {
        this.guildId = guildId
        this.userId = userId
    }
    async get(all = false) {
        await mongo()
        if (all) return await schema.find({ guildId: this.guildId })
        let data = await schema.findOne({ guildId: this.guildId, userId: this.userId })
        if (!data) data = await new schema({ guildId: this.guildId, userId: this.userId })
        return data
    }
    /**
     * @param {} data amount[Number], type[String]: (def: wallet/bank) 
     */
     async add(data) {
        const { amount, type } = data
        const object = { $inc: {} }
        object.$inc[type || 'wallet'] = amount
        await mongo()
        return await schema.findOneAndUpdate({ guildId: this.guildId, userId: this.userId }, object, { upsert: true, new: true })
    }
    /**
     * @param {Number} xp XP to set after leveling up
     */
    async up(xp) {
        await mongo()
        return await schema.findOneAndUpdate({ guildId: this.guildId, userId: this.userId }, { $set: { xp }, $inc: { level: 1 }}, { upsert: true, new: true })
    }
}
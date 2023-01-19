const schema = require('../../mongodb/user')
const mongo = require('../../mongo')
module.exports = class MongoEconomy {
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
     * @param {} data amount[Number], type[String]: (def: wallet/bank) 
     */
     async set(data) {
        const { amount, type } = data
        const object = { $set: {} }
        object.$set[type || 'wallet'] = amount
        await mongo()
        return await schema.findOneAndUpdate({ guildId: this.guildId, userId: this.userId }, object, { upsert: true, new: true })
    }
    async reset(all = false) {
        await mongo()
        if (all) return await schema.updateMany({ guildId: this.guildId }, { $set: { bank: 0, wallet: 0 }})
        return await schema.findOneAndUpdate({ guildId: this.guildId, userId: this.userId }, { $set: { bank: 0, wallet: 0 } }, { upsert: true, new: true })
    }
    async delete(guildId, userId) {
        await mongo()
        return await schema.findOneAndDelete({ guildId, userId })
    }
    async deposit(amount) {
        await mongo()
        return await schema.findOneAndUpdate({ guildId: this.guildId, userId: this.userId }, { $inc: { bank: amount, wallet: amount }}, { upsert: true, new: true })
    }
}
const mongo = require('../../mongo')
const schema = require('../../mongodb/shop')
module.exports = class MongoShop {
    constructor(guildId) {
        this.guildId = guildId
    }
    /**
     * @param {*} data roleId[String], guild[Boolean], all[Boolean], name[String]
     */
    async get(data) {
        const { roleId, guild, all, name } = data
        await mongo()
        if (roleId) return await schema.findOne({ guildId: this.guildId, roleId: roleId })
        if (name) return await schema.findOne({ guildId: this.guildId, name: name })
        if (guild) return await schema.find({ guildId: this.guildId })
        if (all) return await schema.find()
    }
    /**
     * @param {*} data roleId[String], cost[Number], description[String], name[String]
     */
    async add(data) {
        const { roleId, cost, description, name } = data
        await mongo()
        return await schema.create({ guildId: this.guildId, roleId, cost, description, name })
    }
    /**
     * @param {*} data roleId[String], property[String], value
     */
    async update(data) {
        const object = { $set: {} }
        const { roleId, property, value } = data
        object.$set[property] = value
        await mongo()
        return await schema.findOneAndUpdate({ guildId: this.guildId, roleId: roleId }, object, { upsert: true, new: true })
    }
    async delete(guildId, roleId) {
        await mongo()
        return await schema.findOneAndDelete({ guildId, roleId })
    }
}
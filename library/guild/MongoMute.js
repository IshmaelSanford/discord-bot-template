const mongo = require('../../mongo')
const guildSchema = require('../../mongodb/guild')
const muteSchema = require('../../mongodb/mute')
module.exports = class MongoMute {
    constructor(guildId) {
        this.guildId = guildId
    }
    async getGuildData(all = false) {
        await mongo()
        if (all) return await guildSchema.find()
        let data = await guildSchema.findOne({ guildId: this.guildId })
        if (!data) data = await new guildSchema({ guildId: this.guildId }).save()
        return data
    }
    async setRole(roleId) {
        await mongo()
        return await guildSchema.findOneAndUpdate({ guildId: this.guildId }, { $set: { muteId: roleId }}, { upsert: true, new: true })
    }
    /**
     * @param {*} options all[Boolean], guild[Boolean], userId[String]
     */
    async getMuteData(options) {
        await mongo()
        const { all, guild, userId } = options
        if (all) return await muteSchema.find()
        if (guild) return await muteSchema.find({ guildId: this.guildId })
        return await muteSchema.findOne({ guildId: this.guildId, userId })
    }
    /**
     * @param {*} data userId[String], reason[String], end[Number], timestamp[Number]
     */
    async mute(data) {
        await mongo()
        data['guildId'] = this.guildId
        return await muteSchema.create(data)
    }
    async unmute(guildId, userId) {
        await mongo()
        return await muteSchema.findOneAndDelete({ guildId, userId })
    }
}
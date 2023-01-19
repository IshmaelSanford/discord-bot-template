const schema = require('../mongodb/reaction-roles')
const mongo = require('../mongo')
module.exports = class MongoClient {
    constructor(guildId) {
        this.guildId = guildId
        this.getBy = new get(this.guildId)
    }
    /**
     * @summary Creates a new Reaction Role in the Server
     * @param {String} messageId The message ID for the new Reaction Role
     * @param {String} channelId The channel ID where the message is from
     * @param {String} emoteId The emoji ID that will be reacted to the message
     * @param {String} roleId The role ID that will be given when reacted
     */
    async create(messageId, channelId, emoteId, roleId) {
        await mongo()
        await schema.create({ guildId: this.guildId, messageId, channelId, emoteId, roleId })
    }
    /**
     * @summary Deletes Reaction Role Data
     */
    async delete(messageId, channelId, emoteId, roleId) {
        await mongo()
        await schema.findOneAndDelete({ guildId: this.guildId, messageId, channelId, emoteId, roleId })
    }
}
class get {
    constructor(guildId) {
        this.guildId = guildId
    }
    /**
    * @param {String} messageId The message ID of the Reaction Role
    * @param {String} emoteId The emoji ID of the Reaction Role
    * @returns Reaction Role Data
    */
    async message(messageId, emoteId) {
        await mongo()
        return await schema.find({ messageId, emoteId })
    }
    /**
     * Returns an array of Reaction Roles in the Server
     * @param {String} messageId Optional
     * @param {String} channelId Optional
     * @param {String} emoteId Optional
     * @param {String} roleId Optional
     */
    async guild(messageId, channelId, emoteId, roleId) {
        await mongo()
        if (messageId) return await schema.findOne({ guildId: this.guildId, messageId, channelId, emoteId, roleId })
        return await schema.find({ guildId: this.guildId })
    }
}
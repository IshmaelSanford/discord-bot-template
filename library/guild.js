const mongo = require('../mongo')
const schema = require('../mongodb/guild')
module.exports = {
    MongoMute: require('./guild/MongoMute'),
    MongoShop: require('./guild/MongoShop'),
    MongoGuild: class MongoGuild {
        constructor(guildId) {
            this.guildId = guildId 
        }
        async get(all = false) {
            await mongo()
            if (all) return await schema.find()
            let data = await schema.findOne({ guildId: this.guildId })
            if (!data) data = await new schema({ guildId: this.guildId }).save()
            return data
        }
        /**
         * @param {*} data property[String], value, type[String](inc, push, pull, set)
         * @returns 
         */
        async update(data) {
            const object = {}
            object[`$${data.type}`] = { }
            object[`$${data.type}`][data.property] = data.value
            await mongo()
            return await schema.findOneAndUpdate({ guildId: this.guildId }, object, { upsert: true, new: true })
        }
    }
}
module.exports = async function (client, message) {
    require('@utils/command')(client, message)
    require('@utils/mentions')(client, message)
    require('@utils/message')(client, message)
    require('@utils/level')(client, message)
}
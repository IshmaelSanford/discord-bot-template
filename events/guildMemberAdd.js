module.exports = async function(member) {
    const general = member.guild.channels.cache.get('1041011903918510293')
    const rules = "<#1044443940885106788>"
    if (general) general.send(`Welcome to **${member.guild}**, ${member}!\nBe sure to read the ${rules}!`)
}
console.log("photoReactionAdd event triggered")
module.exports = async function(message) {
    if (message.channel.id === `${message.client.config.channels.pic}` && message.attachments.size > 0) {
        message.react(":lovebunny:")
        message.react(":zzmilklove:")
        console.log("Reactions added!")
    };
}


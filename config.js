module.exports = {
    prefix: [','],
    token: "token",
    mongoPath: "url",

    // the id that tracks how many members joined your server
    memberCounterID: ['id'],

    xp: {
        // the base xp required to level up
        base: 500,
        // the amount of xp multiplied by the member's level added to their base in order to level up
        multiplier: 200,
        reward: {
            // the minimum amount of xp they can earn per message per minute
            min: 15,
            // the maximum amount of xp they can earn per message per minute
            max: 25
        }
    },
    spam: {
        mentions: {
            // the maximum number of mentions a member can use
            max: 5,
            // the time between their last mention compared to their most recent that should be accounted for mentions
            // example. If a member previously mentioned 4 different people 6 seconds ago, and they mention 1 now - the 4 mentions are not counted
            // If a member mentioned 4 different people 1 second ago, and mention 5 now - they will be muted
            // However, if a mention mentions the maximum amount of different members (set above ^) in the message, they will be muted immediately
            time: '5s',
            // how long their mute should last
            duration: '30m',
        },
        message: {
            max: 5,
            // the time between their most recent message and their last to be considered spam
            last_time: '2s'
        }
    },

    server: {
        //the name of the server
        name: ['server name'],

        boostRole: ['id'],

    },

    channels: {
        // the channel id(s) that allow the quote command
        quote: ['id'],

        rules: ['id'],

        pic: ['id','id','id'],

        boost: ['id'],
    },
    mafia: {
        100000: {
            roleId: 'id',
        },
        500000: {
            roleId: 'id',
        },
        700000: {
            roleId: 'id',
            // Role assigned to members who are in 2nd, 3rd and 4th place
            top3roleId: 'id',
            // Role assigned to the one member richest among all
            top1roleId: 'id'
        }
    },
    rob: {
        // the amount the target must have in order to rob them
        requirement: 100,
        chance: {
            // the percentage chance of successfully robbing
            base: 20,
            // the percentage increase for every 100000 caps
            increase: 1,
        },
        reward: {
            // the minimum percent money will be robbed
            min: 1,
            // the maximum percent money can be robbed
            max: 25,
        }
    },
    kill: {
        chance: {
            // the base percentage chance of successfully killing
            base: 20,
            // the percentage increase for every 100000 caps
            increase: 1
        },
        // percent taken away from their balance if they failed to kill
        failure: 80
    },
    economy: {
        symbol: { front: "", back: " curency" },
        slots: {
            '🍌': {
                multiplier: 1.5,
                chances: 50
            },
            '🍎': {
                multiplier: 2.5,
                chances: 45
            },
            '🍒': {
                multiplier: 2,
                chances: 35
            },
            '🍉': {
                multiplier: 4,
                chances: 25
            },
            '💵': {
                multiplier: 5,
                chances: 23
            },
        },
        daily: {
            cooldown: '1d',
            reward: { min: 500, max: 500 }
        },
        work: {
            cooldown: '30s',
            reward: { min: 1, max: 50 },
            messages: ["You worked"]
        },
        chop: {
            cooldown: '30s',
            reward: { min: 1, max: 50 },
            messages: ["You chopped down some trees"]
        },
        sell: {
            cooldown: '30s',
            reward: { min: 1, max: 50 },
            messages: ["You sold some scraps"]
        },
        pray: {
            cooldown: '30s',
            reward: { min: 100, max: 550 },
            messages: ['You prayed'],
        },
        fish: {
            cooldown: '5m',
            reward: { min: 100, max: 1500 },
            messages: ['You went fishing']
        }
    }
}
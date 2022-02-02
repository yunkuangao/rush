const {Time, segment} = require("koishi-utils");

module.exports.name = 'love-me'

module.exports.apply = (ctx) => {
    ctx = ctx.group()
    ctx.command('爱我 [who] [...rest]', '治愈人心的赞歌', {maxUsage: 1000, minInterval: Time.minute, authority: 1})
        .alias('爱')
        .example('爱我')
        .action(async ({session}, who) => {
            if (who === undefined) {
                session.send('爱你,' + segment.at(session.userId))
            } else if (who.includes("[CQ:at,id=")) {
                console.log(who)
                let userId = who.match('(0|[1-9][0-9]*)')
                session.send('爱你,' + segment.at(userId[0]))
            } else if (who) {
                let nickname = who.toString()
                if (nickname.length < 2) {
                    session.send('名称太短，至少三个字哟')
                } else {
                    const getGroupMemberMap = await session.bot.getGroupMemberMap(session.channelId);
                    for (const [k, v] of new Map(Object.entries(getGroupMemberMap))) {
                        if (v.includes(nickname)) {
                            return session.send('爱你,' + segment.at(k))
                        }
                    }
                }
            }
        });
}

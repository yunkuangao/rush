// 配置项文档：https://koishi.js.org/api/app.html
module.exports = {
    port: 9002,
    onebot: {
        secret: '',
    },
    autoAuthorize: ses => ses.userId === '317526763' ? 4 : ses.groupId ? 1 : 0,
    delay: {
        message: 0.5 * 1000,
    },
    bots: [
        {
            type: 'onebot:ws',
            // server: 'ws://yunbot_xxx:6700',
            server: 'ws://127.0.0.1:6700',
            selfId: 2709378915,
            token: 'a2122252',
        },
        // {
        //     type: 'discord',
        //     token: 'ODQ0ODU1MTIzNzQxNjM4Njk2.YKYepg.smjfDStiBvkC0F2AThql5gBBTUw',
        // }
    ],
    watch: {
        root: 'custom_plugin',
        ignore: ['xxx']
    },
    plugins: {
        // mysql: {
        //     host: '66.94.124.221',
        //     port: 3307,
        //     user: 'koishi',
        //     password: 'a2122252',
        //     database: 'koishi_xxx',
        //     timeZone: 'Asia/Shanghai',
        // },
        // common: {},
        // rss: {},
        // schedule: {},
        tools: {autoAuthorize: 2},
        './custom_plugin/love_me': {},
        './custom_plugin/eve': {},
        './custom_plugin/setu': {},
        // cryptocurrency: {},
    },
}

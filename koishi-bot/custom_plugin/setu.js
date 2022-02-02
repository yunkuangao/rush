const {Time, segment} = require("koishi-utils");
const axios = require("axios");
const cheerio = require('cheerio')

module.exports.name = 'acg'

module.exports.apply = (ctx) => {
    const logger = ctx.logger('acg')
    ctx = ctx.group()

    const searchUrl = 'https://chevereto.yunkuangao.com/?random';

    ctx.command('acg', '二次元的玩意', {maxUsage: 1000, minInterval: 10 * Time.second, authority: 1})
        .alias('二次元')
        .alias('色图')
        .alias('萌妹子')
        .example('二次元')
        .action(async ({session}) => {
            search(search, (data) => {
                logger.debug(session.nickname + ':' + data);
                if (data == null) {
                    session.send(segment.at(session.userId) + ',图片无了');
                } else {
                    session.send(segment.at(session.userId) + '\n' + segment.image("base64://" + data));
                }
            });
        });

    function search(url, callback) {
        axios.get(searchUrl,
            {
                url: searchUrl,
                headers: {
                    'TOKEN_HEADER': 'setu',
                    'TOKEN_VALUE': 'setu',
                    'HOST_HEADER': 'setu',
                    'IP_HEADER': 'setu'
                },
                proxy: {
                    protocol: 'https',
                    host: 'setu.yunkuangao.com',
                },
            })
            .then(function (response) {
                const $ = cheerio.load(response.data);
                const imgs = $('img');
                let url = ""
                for (let i = 0; i < imgs.length; ++i) {
                    if (imgs[i].attribs.src.search(".md.") !== -1) {
                        url = imgs[i].attribs.src;
                        break;
                    }
                }
                logger.debug(url);
                return download(url, callback);
            })
            .catch(function (error) {
                logger.error(error);
                return callback(null);
            });
    }

    function download(url, callback) {
        axios.get(url,
            {
                responseType: 'arraybuffer'
            })
            .then(response => {
                return callback(new Buffer(response.data, 'binary').toString('base64'));
            })
            .catch(function (error) {
                logger.error(error);
                return callback(null);
            });
    }
}
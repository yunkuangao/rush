const {Time, segment} = require("koishi-utils");
const bot = require('nodemw');
const axios = require("axios");
const xml2js = require('xml2js');
const parser = xml2js.Parser();

module.exports.name = 'eve'

const client = new bot({
    protocol: 'https',
    server: 'www.evebk.com',
    path: '',
    debug: true
});

module.exports.apply = (ctx) => {
    const logger = ctx.logger('eve')
    ctx = ctx.group()
    ctx.command('eve [search]', '查询eve内容', {maxUsage: 1000, minInterval: Time.second, authority: 1})
        .usage('eve 搜索内容')
        .option('kuangwu', '-k')
        .example('eve 巴戈龙级 巴戈龙级的相关信息')
        .action(async ({options, session}, search) => {
            if (options.kuangwu) {
                kuangWuSearch(search, (data) => {
                    logger.debug(session.nickname + ':' + data);
                    session.send(segment.at(session.userId) + '\n' + data);
                });
            } else if (search === undefined) {
                session.send(segment.at(session.userId) + '请输入查询内容喵');
            } else if (search) {
                accurateSearch(search, (data) => {
                    logger.debug(session.nickname + ':' + data);
                    session.send(segment.at(session.userId) + data);
                });
            }
        });

    function kuangWuSearch(search, callback) {
        axios.get('https://www.ceve-market.org/api/evemon')
            .then(function (response) {
                parser.parseString(response.data, function (err, res) {
                    return callback(res.minerals.mineral.map(x => x.name + ':' + x.price + 'isk').toString().replace(/,/g, '\n'));
                });
            })
            .catch(function (error) {
                logger.error(error);
                return callback('未查询到,可能报错了');
            });
    }

    function accurateSearch(search, callback) {
        client.api.call({
            action: 'parse',
            format: 'json',
            page: encodeURI(search),
            section: '1',
            prop: 'wikitext'
        }, async (err, data) => {
            if (err) {
                logger.error(err);
                return fuzzySearch(search, callback);
            }
            let text = data.wikitext['*'];
            return callback(text
                .replace(/[\{\}]/g, '')
                .replace(/[\|]/g, '')
                .replace(/<[^>]+>/g, "")
                .replace(text.substring(text.indexOf("<!--"), text.lastIndexOf("-->") + 3).substring(0, 600), ''));
        });
    }

    function fuzzySearch(search, callback) {
        client.api.call({
            action: 'query',
            format: 'json',
            list: 'search',
            srsearch: search,
            srwhat: 'text',
            srinfo: 'suggestion',
            srprop: 'sectiontitle'
        }, (err, data) => {
            console.log('\n');
            if (err) {
                logger.error(err);
                return callback('查询出错');
            }
            return callback('未查询到,可能为:?\n' + data.search.map(lt => lt.title).join("\n"));
        });
    }
}

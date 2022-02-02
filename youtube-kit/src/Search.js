const inquirer = require('inquirer');
const {program} = require("commander");
const puppeteer = require("puppeteer");

const log = require("./Log");
const {full} = require("./Full");

program.addCommand(
    new program.Command('search')
        .description('通过频道名称搜索')
        .argument('[channelName]', '搜索字符串', '')
        .action(async (channelName) => {
            const config = program.config;
            if (!channelName) channelName = await inputSearchString();
            log.info(`等待查询...`);
            const cInfos = await channelInfos(channelName, config);
            log.debug(JSON.stringify(cInfos));
            const channelId = await choiceChannel(cInfos);
            log.debug(JSON.stringify(channelId));
            config.url = channelId;
            full(config).catch(err => log.error(`报错了 宝贝,${err}`));
        }),
    {},
);

async function inputSearchString() {
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'channelName',
                message: "搜索的youtube频道名称(可模糊):",
            }
        ])
        .then(async (options) => {
            if (options.channelName) {
                return options.channelName;
            }
            log.info(`请输入搜索字符串`);
            await inputSearchString();
        })
        .catch((err) => {
            log.error(`发生错误,${err.message}`);
        });
}

async function channelInfos(searchString, config) {
    const channelInfos = await searchChannel(`https://www.youtube.com/results?search_query=${encodeURI(searchString)}&sp=EgIQAg%253D%253D`, config);
    log.debug(JSON.stringify(channelInfos));
    return channelInfos;

}

async function choiceChannel(channelInfos) {
    return await inquirer
        .prompt([
            {
                type: 'list',
                name: 'channelId',
                message: '你要查找的是:',
                choices: channelInfos.map(channel => {
                    return {key: channel.id, name: channel.name, value: channel.id}
                }),
            },
        ])
        .then((options) => {
            if (options.channelId) {
                return `https://www.youtube.com/c/${options.channelId}/videos`;
            }
            log.error(`发生错误,退出程序`);
            process.exit(1);
        });
}

async function searchChannel(videoUrl, config) {
    log.debug(`开始视频网页浏览器设置`);
    const browser = await puppeteer.launch({
        headless: config.headless,
        timeout: config.timout_youtube,
        args: [`${config.proxy_youtube === '' ? '' : '--proxy-server=' + this}`],
    })
    const page = await browser.newPage();

    log.debug(`打开youtube搜索网页`);
    await page.goto(videoUrl);

    const channels = await page.$$eval('ytd-channel-renderer', channels => {
        return channels.slice(0, 10).map(channel => {
            const titleElement = channel.querySelector('a[id="main-link"]');
            const href = titleElement.href.split('/');
            const id = href[href.length - 1];
            const nameElement = channel.querySelector('yt-formatted-string[id="text"]');
            const name = nameElement.innerText;
            return {id, name};
        })
    });
    log.debug(`获取到的频道:${channels}`);

    await browser.close();

    log.debug(`视频链接获取处理完毕`);
    return channels;
}

module.exports = {

}
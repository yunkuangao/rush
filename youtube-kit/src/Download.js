const puppeteer = require("puppeteer");
const {program} = require("commander");

const log = require('./Log');
const progress = require('./Progress');
const util = require('./Util');

program.addCommand(
    new program.Command('download')
        .description('获取download的视频链接')
        .argument('<channel>', 'youtube频道的id')
        .action(async (youtuber) => {
            const config = program.config;
            const filePath = config.tmp_dir + util.sep + youtuber;
            if (await util.existAndReadFile(filePath)) {
                const urls = util.readFile(filePath);
                const videos = await download(urls, config);
                log.info(`链接为,${videos}`);
            } else {
                log.info(`没有该缓存文件,${youtuber}`);
            }
        }),
    {},
);

const way = new Map([
    ['savefrom', 'https://zh.savefrom.net/'],
    ['youtubemy', 'https://www.youtubemy.com/'],
]);

async function download(videos, config) {

    const browser = await puppeteer.launch({
        headless: config.headless,
        timeout: config.timeout_download,
        args: [`${config.proxy_download === '' ? '' : '--proxy-server=' + this}`],
    })
    const page = await browser.newPage();
    const downloadWayUrl = way.get(config.download_way);
    await page.goto(
        downloadWayUrl,
        {
            waitUntil: 'domcontentloaded',
            timeout: config.timeout_download,
        }
    );

    let dls = [];
    let errors = [];

    const b1 = progress.bar();
    b1.start(videos.length, 0, {speed: "N/A"});

    for (const video of videos) {
        b1.increment();
        switch (config.download_way) {
            case 'savefrom':
                dls.push(await savefrom(page, video, err => {
                    if (err) errors.push(`有视频未能下载,链接为:${video},原因:${err.message}\n`)
                }));
                break;
            case 'youtubemy':
                dls.push(await youtubemy(page, video, err => {
                    if (err) errors.push(`有视频未能下载,链接为:${video},原因:${err.message}\n`)
                }));
                break;
            default:
                log.error(`未找到获取下载链接的方式`);
                process.exit(1);
        }
    }

    b1.stop();

    if (errors.length > 0) log.warn(`${errors}`);

    log.debug(`下载链接为:${dls}`);

    await browser.close();
    return dls;
}

async function savefrom(page, video, fallback) {
    return await page.waitForSelector('input[id=sf_url]')
        .then(text => text.type(video))
        .then(() => page.tap("#sf_submit"))
        .then(() => page.waitForSelector('.download-icon'))
        .then(() => page.$eval('.download-icon', el => el.href))
        .then(href => href)
        .catch(err => fallback(err));
}

async function youtubemy(page, video, fallback) {
    return await page.waitForSelector('input[id=link]')
        .then(text => text.click({clickCount: 3}))
        .then(() => page.waitForSelector('input[id=link]'))
        .then(text => text.type(video))
        .then(() => page.tap("button.start_img"))
        .then(() => page.waitForNetworkIdle())
        .then(() => page.$eval('div.video_files a', el => el.href))
        .then(href => href)
        .catch(err => fallback(err));
}

module.exports = {
    download,
}
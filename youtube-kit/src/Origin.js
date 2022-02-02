const puppeteer = require('puppeteer');
const {program} = require("commander");

const log = require('./Log');
const {bar} = require('./Progress');

program.addCommand(
    new program.Command('youtube')
        .description('获取youtube的视频链接')
        .argument('<channelUrl>', 'youtube频道的url')
        .action(async (channelUrl) => {
            const config = program.config;
            const videos = await origin(channelUrl, config)
            log.info(`链接为,${videos}`);
        }),
    {},
);

async function origin(videoUrl, config) {
    const b1 = bar();

    log.debug(`开始视频网页浏览器设置`);
    const browser = await puppeteer.launch({
        headless: config.headless,
        timeout: config.timout_youtube,
        args: [`${config.proxy_youtube === '' ? '' : '--proxy-server=' + this}`],
    })
    const page = await browser.newPage();

    log.debug(`打开视频网页`);
    try {
        await page.goto(videoUrl, {timeout: config.timeout_youtube});
    } catch (err) {
        log.error(`打开youtube失败,${err.message}`);
        process.exit(1);
    }

    log.info("开始pagedown");
    b1.start(config.pagedown_count, 0, {
        speed: "N/A"
    });
    for (let j = 0; j < config.pagedown_count; j++) {
        b1.increment()
        await page.keyboard.press('PageDown');
        await page.waitForNetworkIdle()
    }
    b1.stop();

    const href = await page.$$eval('a[id="video-title"]', arr => arr.map(a => a.href));
    log.debug(`获取到的视频链接列表:${href}`);

    await browser.close();

    log.debug(`视频链接获取处理完毕`);

    return href;
}

module.exports = {
    origin,
}
const {program} = require("commander");

const log = require("./Log");
const origin = require("./Origin");
const temp = require("./Temp");
const download = require("./Download");
const aria2 = require("./Aria2");

program.addCommand(
    new program.Command('full')
        .description('完整的下载命令')
        .argument('<channelUrl>', 'youtube频道的url')
        .action((channelUrl) => {
            const config = program.config;
            if (channelUrl) config.url = channelUrl;
            full(config).catch(err => log.error(`报错了 宝贝,${err}`));
        }),
    {isDefault: true},
);

async function full(config) {
    const videoUrl = config.url;
    try {

        log.info('从youtube获取视频列表')
        const videos = await origin.origin(videoUrl, config)
        log.info(`获取到${videos.length}条视频`);

        const filename = videoUrl.split('/')[videoUrl.split('/').length - 2]
        const needDownloadUrl = await temp.saveTemp(filename, videos, config);
        log.info(`更新${needDownloadUrl.length}条视频`);

        if (needDownloadUrl.length > 0 || config.flush) {
            log.info('获取下载链接列表')
            const downloadUrl = await download.download(needDownloadUrl, config)
            const downloadTmp = await temp.saveTemp(
                `${filename}_${config.download_way}`,
                downloadUrl,
                config,
            );
            log.info(`将下载链接列表数据缓存到${filename}_${config.download_way}`);

            log.info('往aria2传输下载任务')
            const guids = await aria2.addTask(downloadUrl)
        }

        log.info('完成')
    } catch (err) {
        log.error(`失败,${err.message}`);
    }
}

module.exports = {
    full
}
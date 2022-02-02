const {program} = require("commander");

const util = require('./Util');
const log = require('./Log');

program.addCommand(
    new program.Command('clean')
        .description('清理缓存(可指定频道)')
        .argument('[channel]', '频道id', '')
        .action(async (youtuber) => {
            const config = program.config;
            log.info(`开始搜索文件`);
            const files = util.searchFile(config.tmp_dir, `${youtuber}*`);
            log.info(`已搜索到文件${files.length}个`);
            files.map(file => util.cleanFile(file));
            log.info(`文件清空完毕`);
        }),
    {},
);

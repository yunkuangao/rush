const {program, Option} = require('commander');

require("./src/Origin");
require('./src/Download');
require('./src/Aria2');
require('./src/Temp');
require('./src/Config');
require('./src/Full');
require('./src/Search');
require('./src/Clean');
const config = require("./src/Config");
const log = require('./src/Log');
const packageJson = require('./package.json');

function main() {
    program
        .version(packageJson.version, '-v --version', '版本')
        .argument('<url>', 'youtube的url')
        .option('-f --flush', '不走缓存')
        .option('--level <string>', '日志等级', 'info')
        .option('-u, --url <string>', 'youtube的视频链接')
        .option('--tmp_dir <string>', '缓存目录')
        .option('--no-headless', '浏览器运行')
        .option('--proxy_youtube <string>', '访问youtube的代理地址 例如:127.0.0.1:1080')
        .option('--proxy_download <string>', '访问获取下载链接的代理地址 例如:127.0.0.1:1080')
        .option('--pagedown_count <number>', 'youtube的下滑次数 例如:50')
        .option('--timeout_youtube <number>', 'youtube的访问超时时间 例如:0')
        .option('--timeout_download <number>', '获取下载链接的访问超时时间 例如:0')
        .option('--label_count <number>', '打开多少个标签页 例如:5')
        .addOption(new Option('--download_way <string>', '使用哪种方式获取下载链接 例如:savefrom').choices(['savefrom', 'youtubemy']))
        .hook('preAction', (thisCommand, actionCommand) => {
            program.config = config.build(program.opts());
            const level = program.config.level;
            if (level) log.updateLevel(level);
            log.info(`使用了${program.config.download_way}来获取下载链接`);
        })
        .showHelpAfterError(`发生错误，尝试运行 --help`);
    program.parse(process.argv);
}

module.exports = {
    main,
}

if (require.main === module) {
    main();
}
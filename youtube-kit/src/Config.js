const path = require("path");

const log = require('./Log');
const util = require("util");

class Config {
    level;
    url;
    tmp_dir;
    headless;
    proxy_youtube;
    proxy_download;
    pagedown_count;
    timeout_youtube;
    timeout_download;
    label_count;
    download_way;

    toString() {
        const that = this;
        return JSON.stringify(that);
    }

    [util.inspect.custom](depth, options) {
        return this.toString();
    }
}

function build(options) {
    let config = new Config();

    log.debug(`提供的options:${JSON.stringify(options)}`);

    config.level = options.level || 'info';
    config.url = options.url || '';
    config.tmp_dir = options.tmp_dir || process.cwd() + path.sep + 'videos';
    config.headless = options.headless;
    config.proxy_download = options.proxy_download || '';
    config.proxy_youtube = options.proxy_youtube || '';
    config.pagedown_count = options.pagedown_count || 50;
    config.timout_youtube = options.timeout_youtube || 60000;
    config.timeout_download = options.timeout_download || 60000;
    config.label_count = options.label_count || 5;
    config.flush = options.flush || false;
    config.download_way = options.download_way || 'savefrom';

    log.debug(`生成的config:${config}`);

    return config;
}

module.exports = {
    build,
}
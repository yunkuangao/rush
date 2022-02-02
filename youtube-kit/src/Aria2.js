const Aria2 = require("aria2");
const path = require("path");
const {program} = require("commander");
const ws = require("ws");

const util = require('./Util');
const log = require('./Log');

program.addCommand(new program.Command('aria2')
    .description('将download的缓存数据推到aria2')
    .argument('<youtuber>', 'youtuber的唯一id')
    .action(async (youtuber) => {
        const config = program.config;
        const filePath = config.tmp_dir + path.sep + youtuber;
        if (await util.existAndReadFile(filePath)) {
            const urls = util.readFile(`${filePath}_${config.download_way}`);
            const videos = await addTask(urls);
            log.info(`链接为,${videos}`);
        } else {
            log.info(`没有该缓存文件,${youtuber}`);
        }
    }), {},);

const aria2 = new Aria2({
    WebSocket: ws,
    host: '127.0.0.1',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc',

});

let defaultDir = './download'

async function addTask(tasks, dir) {
    if (dir) defaultDir = dir;
    return tasks.filter(task => /^https?:\/\/.+/.test(task)).map(async task => await aria2.call("addUri", [task], {} || (task.indexOf('title') !== -1 && {out: util.validFileName(decodeURI(getQueryVariable(task, 'title'))) + '.mp4'})));
}

function getQueryVariable(url, queryStr) {
    let vars = url.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] === queryStr) {
            return pair[1];
        }
    }
    return false;
}

module.exports = {
    addTask,
}
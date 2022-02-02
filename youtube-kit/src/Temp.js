const os = require("os");
const path = require("path");

const log = require('./Log');
const util = require('./Util');

function saveTemp(filename, urls, config) {

    // 缓存文件路径
    const filePath = config.tmp_dir + path.sep + filename;

    // 检查文件是否存在 不存在则创建
    util.existOrCreateFile(filePath)

    let writeUrl;

    if (config.flush) {
        // 不走缓存
        util.cleanFile(filePath);
        writeUrl = urls;
    } else {
        try {
            const existUrl = util.readFile(filePath).toString().replace(/\r\n/g, '\n').split('\n');
            writeUrl = urls.filter(url => !existUrl.includes(url));
        } catch (err) {
            log.error(`读取文件失败,${err.message}`);
        }
    }

    if (writeUrl.length > 0) {
        try {
            log.debug(`将数据缓存在${filePath}中,添加了${writeUrl.length}条`);
            util.writeFile(filePath, os.EOL + writeUrl.join(os.EOL));
        } catch (err) {
            log.error(`写入文件失败,${err.message}`);
        }
    }

    return writeUrl;
}

module.exports = {
    saveTemp,
}
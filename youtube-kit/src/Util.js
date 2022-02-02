const os = require("os");
const fs = require("fs");
const glob = require('glob');
const sep = require("path").sep;

function opt(options, name, default_value) {
    return options && options[name] !== undefined ? options[name] : default_value;
}

function osName() {
    const osType = os.type().toLowerCase();
    switch (osType) {
        case osType.indexOf('win') !== -1 :
            return 'win';
        case osType.indexOf('linux') !== -1:
            return 'linux';
        case osType.indexOf('mac') !== -1:
            return 'mac';
    }

    return os.type().toLowerCase();
}

function chromePath() {
    const osType = osName();
    switch (osType) {
        case 'win' :
            return `./chromium/win/chrome/chrome.exe`;
        case 'linux' :
            return `./chromium/linux/chrome/chrome`;
        case 'mac' :
            return `./chromium/mac/chrome/chrome`;
        default:
            return '';
    }
}

function now() {
    return new Date().toLocaleString();
}

function validFileName(str) {
    const invalid_char = `~!@#$%^&*，。；‘’\\{【】[]}|`;
    let result = ''
    for (let s of str) {
        if (invalid_char.indexOf(s) !== -1) {
            result += '_'
        } else {
            result += s
        }
    }
    return result
}

function getSubArrays(arrays = [], subArrayCount = 1) {

    const lessThan = arrays.length < subArrayCount;

    let result = Array.from({length: lessThan ? arrays.length : subArrayCount}, () => []);

    for (const i in arrays) {
        result[i % subArrayCount].push(arrays[i]);
    }
    return result;
}

function existOrCreateFile(filePath) {
    fs.openSync(filePath, 'a');
}

async function existAndReadFile(filePath) {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
        return true;
    } catch {
        return false;
    }
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        throw err;
    }
}

function appendFile(filePath, data) {
    try {
        fs.appendFileSync(filePath, data);
    } catch (err) {
        throw err;
    }
}

function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
    } catch (err) {
        throw err;
    }
}

function cleanFile(filePath) {
    fs.truncate(filePath, 0, () => {
    });
}

function searchFile(dir, pattern) {
    return glob(`${dir}/${pattern}`, {sync: true});
}

module.exports = {
    sep,
    opt,
    osName,
    chromePath,
    validFileName,
    now,
    getSubArrays,
    existOrCreateFile,
    existAndReadFile,
    readFile,
    cleanFile,
    searchFile,
    appendFile,
    writeFile,
}
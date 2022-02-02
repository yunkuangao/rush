const cliProgress = require("cli-progress");

function bar() {
    return new cliProgress.SingleBar(
        {
            format: '进度: [{bar}] {percentage}% | 用时: {duration}s | 预计剩余时间: {eta}s | {value}/{total}'
        },
        cliProgress.Presets.shades_classic
    );
}

module.exports = {
    bar,
}
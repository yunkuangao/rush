# youtube-download

这是个无聊的项目，用于抓取youtube的videos并通过savefrom或者youtubemy网站获取下载链接，然后传输给aria2进行下载

## 食用方法

```shell
#安装程序
npm install -g ytbk
# 一定是后缀为videos的链接
ytbk https://www.youtube.com/channel/UCMUnInmOkrWN4gof9KlhNmQ/videos
#帮助命令
ytbk --help 
```

## 使用技术

puppeteer 
aria2 
cli-progress 
commander 
winston 
inquirer
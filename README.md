[![npm package](https://img.shields.io/npm/v/msxcli.svg)](https://www.npmjs.com/package/msxcli)

# 前端项目生成工具
快速生成一个可用的前端项目的脚手架，包括express、koa、react、vue、angular，用于部分架构的补充和完善，方便平台模拟和调试开发。

# 基本使用

### 安装
```shell
npm install -g mscli
# express 项目
mscli express app-name
# koa 项目
# mscli koa app-name
npm install
npm start

# 查看项目帮助
mscli express -h
```

## express 项目:

### 参数
-p --page 是否是一个带页面的项目
-u --upload 是否是一个带上传功能的项目
-s --sql 是否是一个带sql查询的项目，这个现在只支持mysql

### 使用

```shell
# 一个带页面但是没上传和sql的项目，如果默认不带参数是所有参数都带有的
mscli express -p app-name
```

# License
msxcli is MIT licensed.
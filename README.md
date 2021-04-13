<div align="center">

# 椰羊cocogoat  
一个原神工具箱。是半仙之兽。  

![GitHub release (latest by date)](https://img.shields.io/github/v/release/YuehaiTeam/cocogoat)
[![Build Test](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml/badge.svg)](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml)

</div>

## 下载
 - 正式版下载：[Release](https://github.com/YuehaiTeam/cocogoat/releases) 
 - 国内服务器：[七七](https://77.cocogoat.work/v1/ascension/)
 - 测试版：[TestBuilds](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml) (自动构建，可能不稳定或完全无法工作)

## 功能
 - 圣遗物OCR识别
 - 圣遗物自动切换

### 圣遗物导出
 - 使用游戏字体特殊训练的本地`tesseract` OCR  
 - 支持所有服务器(天空岛、世界树、外服)  
 - 支持大部分游戏分辨率、部分云游戏平台  
 - 目前暂时仅支持识别中文  

### 圣遗物自动切换
 - 使用`opencv`自动检测圣遗物列表，并自动点击和切换
 - 可关联自带OCR功能自动识别，也可配合其他识别工具使用

## 更新
 - 如果您正在使用`v0.3.1`及以上版本，您可以在"设置"页面检查并自动升级。  
   程序会首先尝试增量更新，失败后下载全量包，并覆盖自身。
 - 如果您使用的版本还没有更新功能，请重新下载新版。

## 遇到问题？
 - 您可以[搜索或提交issue](https://github.com/YuehaiTeam/cocogoat/issues)

## 参与开发 
本项目基于 `typescript`, `vue.js`, `electron` 和 `vue-cli-electron-builder` 开发，我们欢迎一切有关的讨论、帮助和Pull Requests。  
有关打包和更新的相关说明，请参见 [builds](https://github.com/YuehaiTeam/cocogoat/tree/main/build) 文件夹的README。
 - 本地运行: `yarn electron:serve`
 - 本地打包: `yarn electron:build`

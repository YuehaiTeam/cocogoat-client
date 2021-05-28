[English](https://github.com/YuehaiTeam/cocogoat/blob/main/README_en.md)
<div align="center">

# 椰羊cocogoat  
一个原神工具箱。是半仙之兽。  

![GitHub release (latest by date)](https://img.shields.io/github/v/release/YuehaiTeam/cocogoat)
[![Build Test](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml/badge.svg)](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml)
![MIT License](https://shields.io/badge/license-MIT-green)
[![POEditor - English](https://img.shields.io/poeditor/progress/434087/en?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)
[![POEditor - Japanese](https://img.shields.io/poeditor/progress/434087/ja?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)
[![POEditor - Portuguese (BR)](https://img.shields.io/poeditor/progress/434087/pt-br?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)
[![POEditor - Russian](https://img.shields.io/poeditor/progress/434087/ru?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)

</div>

## 下载
 - 正式版下载：[Release](https://github.com/YuehaiTeam/cocogoat/releases) 
 - 国内服务器：[七七](https://77.cocogoat.work/v1/ascension/)
 - 测试版：[TestBuilds](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml) (自动构建，可能不稳定或完全无法工作)

## 功能
 - 圣遗物OCR识别
 - 圣遗物自动切换

### 圣遗物导出
 - 使用游戏字体特殊训练的本地[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
 - 支持所有服务器(天空岛、世界树、外服)  
 - 支持大部分游戏分辨率、部分云游戏平台  
 - 目前暂时仅支持识别中文  
 - 可以导出到其他工具进行最大伤害计算、自动配装等。目前支持的格式如下：
   - [莫娜占卜铺](https://www.mona-uranai.com/)
   - [Mingyulab](https://genshin.mingyulab.com/)
   - [genshin-optimizer](https://frzyc.github.io/genshin-optimizer/)

### 圣遗物自动切换
 - 使用`opencv`自动检测圣遗物列表，并自动点击和切换
 - 使用`ViGEm`模拟手柄并自动切换（需手动开启）
 - 可关联自带OCR功能自动识别，也可配合其他识别工具使用

## 数据保存与便携版
程序默认数据保存在`%appdata%/cocogoat/config`下。若需便携使用（如放入U盘携带等），您可以在程序exe文件所在位置新建`cocogoat`文件夹，程序启动时将以此文件夹作为数据目录。

## 遇到问题？
**常见问题：**
 - Q: 为什么窗口背景是白色而不是透明？  
   A: 如果你正在使用 Windows 7 系统，请开启系统的Aero功能，详细方式可以参考百度。
 - Q: 为什么需要管理员权限？  
   A: 原神游戏使用管理员权限运行，如果以普通权限运行程序，我们将无法进行模拟点击和滚轮操作。
 - Q: 会发送我的游戏数据到服务器吗？  
   A: 不会。所有需要发送到服务器的数据都会在发送前提示你（比如反馈），即使是崩溃报告也可以在设置里关闭。
 - Q: 能否导出数据到....  
   A: 未来可期，只需要带着需要的导入格式提交PR/issue/加群反馈......

**已知问题：**
 - 如果游戏显示比例不是16:9，可能会出现出现识别窗口无法对齐的问题，建议调节游戏分辨率。  
   推荐分辨率：**1920x1080**和**1600x900**。
 - 部分用户可能遇到`cannot load xxxxx.dll`并无法启动程序问题，如有遇到请下载[特制版](https://77.cocogoat.work/v1/ascension/特制版/)，该问题属于打包工具，已尝试反馈，正在等得回复。

如您的问题未在此处列出或遇到不明闪退问题，您可以[搜索或提交issue](https://github.com/YuehaiTeam/cocogoat/issues)或者[加入交流群：933468075](https://jq.qq.com/?_wv=1027&k=Pl2MFHcA)反馈。

## 更新
 - 如果您正在使用`v0.3.1`及以上版本，您可以在"设置"页面检查并自动升级。  
   程序会首先尝试增量更新，失败后下载全量包，并覆盖自身。
 - 如果您使用的版本还没有更新功能，请重新下载新版。

## 参与开发 
本项目基于 `typescript`, `vue.js`, `electron` 和 `vue-cli-electron-builder` 开发，我们欢迎一切有关的讨论、帮助和Pull Requests。  
有关打包和更新的相关说明，请参见 [builds](https://github.com/YuehaiTeam/cocogoat/tree/main/build) 文件夹的README。
 - 本地运行: `yarn electron:serve`
 - 本地打包: `yarn electron:build`

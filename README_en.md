[中文](https://github.com/YuehaiTeam/cocogoat/blob/main/README.md)
### IMPORTANT： Multilingual support is still on the way. Please let us know if you need other languages other than Chinese and English. See [this issue](https://github.com/YuehaiTeam/cocogoat/issues/6).

<div align="center">

# cocogoat  
A toolbox for Genshin Impact with every line of code made by working overtime.

![GitHub release (latest by date)](https://img.shields.io/github/v/release/YuehaiTeam/cocogoat)
[![Build Test](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml/badge.svg)](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml)
![MIT License](https://shields.io/badge/license-MIT-green)
[![POEditor - English](https://img.shields.io/poeditor/progress/434087/en?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)
[![POEditor - Japanese](https://img.shields.io/poeditor/progress/434087/ja?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)

</div>

## Downloads
 - [Release](https://github.com/YuehaiTeam/cocogoat/releases) 
 - For users in China: [QiQi](https://77.cocogoat.work/v1/ascension/)
 - Testing versions built by [Github Actions](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml) (may be unstable)

## Features
 - Recognize artifacts by OCR using [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
 - Auto switching artifacts by simulating clicking and scrolling
 - Export data to calculating websites for more usage.
   - [Mona-uranai](https://www.mona-uranai.com/)(Chinese only)
   - [Mingyulab](https://genshin.mingyulab.com/)  
   - [genshin-optimizer](https://frzyc.github.io/genshin-optimizer/)  

## FAQs
 - Q: Why the overlays are not transparent?  
   A: If you're using Windows 7 , you need to enable Aero.
 - Q: Why the application needs to be run as administrator?  
   A: Genshin Impact itself runs as administrator, so we also need administrator rights to simulate click in it.
 - Q: Is it safe? Will it send my game data to any servers?  
   A: Yes. We will not send any sensitive data without permission, and even crash reporting can be disabled.
 - Q: Can I export data to formats of xxx, yyy zzz?   
   A: Maybe in the future. Why not open some pull requests?

## Contact or Feedback
 - Any issues are welcomed. Don't be scared by plenty of Chinese! We'll answer you in English.
 - For Chinese-reading users, our QQ group is [933468075](https://jq.qq.com/?_wv=1027&k=Pl2MFHcA).

## Contribuilting
This project is based on `typescript`, `vue.js` and `electron` using `vue-cli-electron-builder`.  
Feel free to contribute by creating any pull requests!

 - Run locally: `yarn electron:serve`
 - Build locally: `yarn electron:build`
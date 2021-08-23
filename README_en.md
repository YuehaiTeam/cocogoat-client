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
[![POEditor - Portuguese (BR)](https://img.shields.io/poeditor/progress/434087/pt-br?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)
[![POEditor - Russian](https://img.shields.io/poeditor/progress/434087/ru?token=d0ebc6efc6db6d4c57aaa1103a0c4abd)](https://poeditor.com/join/project?hash=jZiEtV01OO)

</div>

## Downloads
 - [Full Releases](https://github.com/YuehaiTeam/cocogoat/releases) 
 - For users in China: [QiQi](https://77.cocogoat.work/v1/ascension/)
 - Testing versions built by [Github Actions](https://github.com/YuehaiTeam/cocogoat/actions/workflows/build-test.yml) (may be unstable)

## Features
 - Recognize artifacts by OCR using [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
 - Auto switching artifacts by simulating clicking and scrolling
 - Support for all servers (Celestia、Irminsul、Foreign Servers)  
 - Support for most game resolutions and some cloud gaming platforms  
 - Currently only supports Chinese character recognition
 - Uses `opencv` to automatically detect the artifact list, click and switch between artifacts.
 - Uses `ViGEm` to emulate a gamepad and automatic switching（Must be enabled manually）
 - Export data to calculating websites for additional functionality.
   - [Mona-uranai](https://www.mona-uranai.com/) (Chinese only)
   - [Mingyulab](https://genshin.mingyulab.com/)  
   - [genshin-optimizer](https://frzyc.github.io/genshin-optimizer/)  
 - Floating Minimap
   - [Experimental] Recognize the minimap and sync location with the floating map
   - Uses `OpenCV` to recognize the ingame minimap, calculates the coordinates and syncs with the interactive map in the floating window.
   - Currently only supports miHoYo's map（Chinese version）
   - Built-in [Seelie Plugin](https://chrome.google.com/webstore/detail/seelie/jkapcfbicpbhigopkhpielmbkgfchdgh) functionality（with permission）

## Issues
**Common Questions：**
 - Q: Why is the window background white instead of transparent？  
   A: If you are using windows 7, please enable Aero in your settings. For information on how to do this, please refer to google.
 - Q: Why are admin rights needed？  
   A: Genshin runs with administrator privledges, so if you run the program without admin rights, the application will not be able to use the click or scrolling functionality.
 - Q: Is it safe? Will it send my game data to any servers？  
   A: Yes it is safe. No data (such as feedback and crash reports) is sent without permission, and can be turned disabled in the settings as well.
 - Q: Can this export data to...
   A: Perhaps in the future. If you want to see support for additional services, please submit a PR or Issue detailing or implementing the desired support!

**Known Issues：**
 - If the aspect ratio of the game is not 16:9, the recognition window may not align properly. We recommend adjusting the game resolution to the correct aspect ratio.  
   Recommended resolutions：**1920x1080** & **1600x900**。
   
## Data Storage and Portable mode
The default data location for the app is `%appdata%/cocogoat/config`. To use the application in portable mode (On a flash drive, etc), you can create a `cocogoat` folder in the same location as the exe file and this folder will be used as the data directory when you start the app.

## Updates
 - If you are using `v0.3.1` or newer, you can check for updates automatically in the "settings" section.
   The app will attempt to do incremental upgrades and will download the full package and overwrite itself if this fails.
 - If the version you have lacks the update function, please download the latest version

## Contact or Feedback
 - Any issues are welcomed. Don't be scared by plenty of Chinese! We'll answer you in English.
 - For Chinese-reading users, our QQ group is [933468075](https://jq.qq.com/?_wv=1027&k=Pl2MFHcA).

## Contributing
This project is based on `typescript`, `vue.js` and `electron` using `vue-cli-electron-builder`.  
Feel free to contribute by creating pull requests or submitting bug reports/feature requests!

 - Run locally: `yarn electron:serve`
 - Build locally: `yarn electron:build`

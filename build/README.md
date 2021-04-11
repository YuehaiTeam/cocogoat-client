# 打包与更新说明

## 打包
使用`Enigma Virtual Box`打包为单文件并Gzip压缩。

## 自动更新
从`Github Release`获取版本信息，下载时从给定的地址下载以提高国内访问速度。  
由于`Eletron`比较重，本项目引入了使用[HDiffPatch](https://github.com/sisong/HDiffPatch)算法的增量更新。  
因为是单文件运行，所以更新时将释放由`cocomilk.nsi`编译的NSIS安装包`cocomilk.exe`到缓存目录，负责新版本文件的下载、增量包的处理与最后的替换文件和重新启动程序。
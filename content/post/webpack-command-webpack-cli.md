---
title: webpack-command 将取代 webpack-cli
date: 2018-6-22
dateModified: 2018-7-9
tags:
  - webpack
  - 新闻
toc: false
---

2018.2.25，webpack 4.0.0 正式发布，[该版本](https://github.com/webpack/webpack/releases/tag/v4.0.0)将 webpack 命令行代码迁移到 [webpack-cli](https://github.com/webpack/webpack-cli)。

于是我们在使用 webpack 4 时，会看到如下提示：

> The CLI moved into a separate package: webpack-cli
> Would you like to install webpack-cli? (That will run npm install -D webpack-cli) (yes/NO)

但让人意外的是，webpack 4.0.0 正式发布那天，就又出来一个极其类似的项目 [webpack-command](https://github.com/webpack-contrib/webpack-command)，而且官方最近宣称它将[取代 webpack-cli 项目](https://medium.com/webpack/unladen-swallows-and-the-deprecation-of-webpack-cli-39814f6694d3)：

> 2018 年 6 月底用户安装 webpack-cli 时将被重定向到 webpack-command，等 webpack 5 正式发布，webpack-cli 将被废弃。

## 更新

事情有变：webpack-command 作者称 webpack 项目带头人不支持 webpack-cli 迁移到 webpack-command 的计划。
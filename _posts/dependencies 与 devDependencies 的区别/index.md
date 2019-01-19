---
title: 区别 dependencies、devDependencies
author: 陈三
toc: false
permalink: /difference-between-dependencies-and-devdependencies
date: 2014-05-05T17:36:09+00:00
tags:
  - npm
---

我们在执行 `npm install` 安装依赖时，通常都会将依赖的名称、版本要求写入 `package.json` 文件。

其中有两个命令行参数：

1. `--save-prod` 将依赖的名称、版本要求写入 dependencies
2. `--save-dev` 将依赖的名称、版本要求写入 devDependencies

从命令行参数字面上，我们就能看出 dependencies、devDependencies 的区别：dependencies 表示我们要在生产环境下使用该依赖，devDependencies 则表示我们仅在开发环境使用该依赖。

举个例子，我要用 `webpack` 构建代码，所以在开发环节，它是必需的，但对普通用户来说，它是不必要的，所以安装 `webpack` 时，我要执行：

```bash
npm install webpack --save-dev
```
而不是：

```bash
npm install webpack --save-prod
```
不过，在 [npm 5 发布](http://blog.npmjs.org/post/161081169345/v500)以前，答案并没有这么直观。

在 npm 5 发布以前，我们执行 `npm install` 后，npm 只会下载依赖到当前目录的 `node_modules`，并不会在 `package.json` 中写入依赖的信息。

那时我们也有两个参数可以使用：

  1. `--save` 将依赖的名称、版本要求添加到 dependencies
  2. `--save-dev` 将依赖的名称、版本要求添加到 devDependencies

显然，`--save` 与 `--save-dev` 的区别远不如 `--save-prod` 与 `--save-dev` 这么清楚。

或许 npm 该考虑把 dependencies 改成 prodDependencies，这样就能减少误会。

---
title: Node.js 命令行工具如何传递参数
date: 2018-12-25
permalink: /node-js-pass-arguments
tags:
  - Node.js
---

你用 Node.js 小试牛刀，写了个命令行工具：

```js
#!/usr/bin/env node
'use strict'
const command_line_tool = require('./lib/index')
command_line_tool()
```
并且在 `package.json` 中注册好了：

```json
  "bin": {
    "omg": "./index.js"
  },
```
安装完后，你可以在命令行下调用 `omg` 命令。

你觉得很酷，但很快你就发现命令非常慢。你想分析下命令的 CPU 使用情况，你想到了 Node.js 内置的分析器，可以通过 `--prof` 参数调用。

但现状是，我们执行命令时，是 `omg` 的形式，要怎么传递 `--prof` 给 Node？

一个马上能想到的方案是，

```js
#!/usr/bin/env node --prof
```
当然，这个方案并不现实，万一这个命令行工具是别人写的呢？我总不能打开源代码修改吧？

还有一种方案，是这样的：

```
$ node --prof /path/to/omg
```
注意，我们在这里必须使用 `omg` 的绝对路径，否则 Node 会尝试在当前目录中寻找它 - 就会出现模块不存在的错误。
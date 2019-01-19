---
title: Jest 如何 mock require.resolve
date: 2018-09-7
permalink: /how-to-mock-require-resolve-under-jest
tags:
  - jest
---

在 [Jest](https://jestjs.io/en) 下，要 mock 模块不外两种情况：

1. 用户自己写的模块
2. Node.js 核心模块

第一种模块需要我们在模块的同级目录新增一个 `__mocks__` 目录，然后在 `__mocks__` 下定义一个同名模块。

比如我们项目中有个 `format.js` 模块，则模块与 mock 模块的目录结构是这样：

```
- format.js
- __mocks__
  - format.js # <- mock 文件在此
```
至于 Node 核心模块，则要求我们在项目根目录下的 `__mocks__` 目录下添加 mock 模块：

```
- node_modules
- __mocks__
  - fs.js # <- mock 文件在此
```
那么，`require.resolve` 属于哪种情况？显然，`require` 是特殊的，它并不算 Node 核心模块，因为我们不用 `require('require')`，实际上，我们也不能 `require('require')`。

我找了一圈，并没有找到解决办法。

但有一时突然来灵感。是了，这就是个脑筋急转弯的问题。

我们把 `require.resolve` 定义成一个用户模块 `requireResolve.js` 就成了：

```js
module.exports = require.resolve
```
这样我们就可以在 `__mocks__` 目录下定义一个 `requireResolve.js`：

```js
module.exports = function (moduleName) {
  return ''
}
```


---
title: NW.js 与 webpack、React.js
date: 2018-09-05
permalink: /nw-js-webpack-react
tags:
  - React.js
  - webpack
  - NW.js
---

> TL;DR
>
> 1. 设置 webpack 的 `target` 值为 `node-webkit`
> 2. 设置 `package.json` 字段 `node-remote` 为 `<all_urls>`

事情是这样，我手头有一个 react.js 项目，是用 [create-react-app](https://github.com/facebook/create-react-app) 搭建的。半途，出于一些只有桌面端应用才能做到的需求，决定启用 [NW.js](https://nwjs.io/)，看看效果如何。

按照 [NW.js 入门教程](http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/)，我在 `package.json` 中新增 `main` 字段：

```json
"main": "http://localhost:3000"
```

不出意外，NW.js 启动后，几个操作下来，就看到控制台报错：

```
TypeError: __WEBPACK_IMPORTED_MODULE_9_fs___default.a.writeFile is not a function
```

这是因为我的代码里有这么一句：

```js
fs.writeFile()
```
我们可以尝试在调用 `fs.writeFile` 前打印 `fs`，结果是：

```
{}
```
一个空对象。除了 `fs` 外，还有 `dgram`、`net`、`tls` 及 `child_process`，它们均是空对象。

原因很简单，create-react-app 面向的是浏览器，并不是 NW.js 或 Electron 这样的运行环境。所以 create-react-app 预置的 webpack 配置里，将上述几个 Node.js 模块指定为 `empty`：

```js
// Some libraries import Node modules but don't use them in the browser.
// Tell Webpack to provide empty mocks for them so importing them works.
node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
```

你可能马上想到，把 `fs: 'empty'` 移除掉来解决问题。然而，这是错的。这并不解决问题。

前面说过，create-react-app 面向的是浏览器，因此 webpack 在构建时，[`target`](https://webpack.js.org/configuration/target/) 默认为 `web`，而除了 `web` 外，我们其实还有 `node-webkit` 可选：

> > Compile for usage in WebKit and uses JSONP for chunk loading. Allows importing of built-in Node.js modules and nw.gui (experimental)

是了，我们需要调整 webpack 配置。在 create-react-app 下，我们首先得弹出配置：

```
npm run eject
```
这样所有的 `webpack` 配置等都放到 `config` 目录下。

打开 `config/webpack.config.dev.js` 文件，新增 `target` 配置：

```js
target: 'node-webkit'
```
重新执行 `yarn start` 后发现，新的错误来了，大概长这样：

```
Uncaught ReferenceError: require is not defined
    at Object.crypto (external "crypto":1)
    at __webpack_require__ (bootstrap 273f05570806e725be93:678)
    at fn (bootstrap 273f05570806e725be93:88)
    at Object../node_modules/sockjs-client/lib/utils/random.js (random.js:4)
    at __webpack_require__ (bootstrap 273f05570806e725be93:678)
    at fn (bootstrap 273f05570806e725be93:88)
    at Object../node_modules/sockjs-client/lib/utils/event.js (event.js:3)
    at __webpack_require__ (bootstrap 273f05570806e725be93:678)
    at fn (bootstrap 273f05570806e725be93:88)
    at Object../node_modules/sockjs-client/lib/transport/websocket.js (websocket.js:3)
```

require is not defined？WTF？？

问题显然并不出在 `sockjs-client` 库，而是我们设定 `target` 为 `node-webkit` 后，webpack 不再构建客户端使用的一些 Node.js 模块，它们以 `require` 的形式存在。而浏览器下并没有 `require`，于是抛出错误。

怎么办？

不出意外，NW.js 提供了解决办法 - [`node-remote`](http://docs.nwjs.io/en/latest/References/Manifest%20Format/#node-remote) 配置项，它的作用是这样：

> Enable calling Node in remote pages

是的，你可以在 remote pages 中调用 Node。

你可能一头雾水，什么是 remote pages？好吧，我承认，我也不知道。NW.js 的维基里并没有解释什么是 remote pages。

注意，文档里虽然罗列 `file` 协议，但其实 [NW 不支持](https://github.com/nwjs/nw.js/issues/3571#issuecomment-260265366)。也因此，最后我选择了 `<all_urls>`。

打开 `package.json`，新增字段 `node-remote`：

```
  "main": "http://localhost:3000",
+ "node-remote": "<all_urls>"
```
再次启动 NW.js，问题已解决。

最后，切记 `webpack.config.prod.js` 中也要添加 `target: 'node-webkit'`。部署时，还需要将 `main` 字段的值调整为 `build/index.html`。
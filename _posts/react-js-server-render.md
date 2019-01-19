---
title: React.js 服务器端渲染
date: 2016-02-05T14:01:43+00:00
permalink: /react-js-server-render
excerpt: 服务器端渲染 React.js 应用的必要性，以及如何在服务器端渲染 React 应用。
tags:
  - React.js
---

> 本文基于 React.js 16，webpack 4

部署 React.js 应用其实非常方便，为什么还要折腾服务器端渲染？是否多此一举？

## 客户端渲染的问题

客户端渲染存在几个问题：

1. 用户初次访问的体验不好
2. 对 SEO 不友好

### 用户体验

客户端渲染的页面通常很简洁：

```html
<!doctype html>
<html>
  <head>
    <title>这是一个单页面应用</title>
  </head>
  <body>
    <div id='root'></div>
    <script src='app.min.js'></script>
  </body>
</html>
```
访问该页面，浏览器便开始解析 HTML 并加载 `app.min.js` 文件，加载完成浏览器执行 js，接着 `<div id='root'></div>` 下会生出许多节点，并且具备交互能力。

但这里有两个问题：

1. 在 js 文件加载完成并执行以前，我们只看到一片空白，
2. 一旦 js 文件中有错误，也可能导致页面空白。

无论哪种情况，对用户来说，都是糟糕的体验。

而服务器端渲染能够改善用户体验：

1. 用户能马上看到页面内容 - 而不是等待 js 文件下载、执行完成后才能看到，
2. 哪怕 js 中有错误，也只会导致页面交互问题，而不是一片空白。

### SEO 需要

我们希望搜索引擎能抓取完整的 HTML 页面，而不是上面示例中的 `<div id='root'></div>`。虽说 [Google 已经有能力抓取单页面应用](https://webmasters.googleblog.com/2015/10/deprecating-our-ajax-crawling-scheme.html)，但我们并不能保证所有的搜索引擎都可以。服务器端渲染则能够提供完整的 HTML 内容给搜索引擎，对 SEO 更友好。

## 服务器端渲染流程

传统的服务器端渲染大致是这样一个流程：

1. 从数据库读取数据，
2. 编译模板并生成 HTML，
3. 返回 HTML 给客户端，
4. 浏览器解析 HTML 并下载 HTML 页面中的脚本然后执行。

React.js 的服务器端渲染也是同理，只不过，这里模板换成了 React.js 组件，JavaScript 事件处理器的绑定则由 React.js 操作：

1. 从数据库读取数据，
2. 编译 React.js 组件并生成 HTML 代码，
3. 返回 HTML 给客户端，
4. 浏览器解析 HTML 并下载 HTML 页面中的 React.js 代码然后注入事件处理器。

## 服务器端如何渲染 React.js

我们将使用 [`ReactDOMServer`](https://reactjs.org/docs/react-dom-server.html) 提供的 `renderToString` 方法在服务器端渲染 React.js 组件。不过在那之前，我们需要先完成我们的单页面应用。

### 搭建 React.js 单页面应用

通常情况下，我们应该使用 [neutrino.js](https://neutrino.js.org/packages/react/) 或 [create-react-app](https://github.com/facebook/create-react-app) 一类工具来开发 React.js 应用，但它们的适用场景并未考虑到服务器端渲染，所以我们将直接使用 `webpack`。

首先，新建一个 `react-server-render` 目录，

```bash
$ mkdir react-server-render
```
然后进入该目录并初始化项目：

```bash
$ cd react-server-render
$ yarn init -y
```
接着在目录下新增 `index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React 服务器端渲染</title>
</head>
<body>
  <div id="root"></div>
  <script src="dist/main.js"></script>
</body>
</html>
```
接着是安装 `react` 与 `react-dom`：

```bash
$ yarn add react react-dom
```
安装完成后，在 `react-server-render` 下新建一个 `src` 目录，在 `src` 下新建 `index.js` 以及 `App.js`，两个文件的内容分别如下：

index.js：
```js
const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')
ReactDOM.render(React.createElement(App), document.getElementById('root'))
```
App.js：
```js
const React = require('react')
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      warn: false
    }
  }
  render () {
    const self = this
    return React.createElement('div', {
      onClick: function () {
        self.setState({
          warn: !self.state.warn
        })
      },
      style: {
        color: this.state.warn ? 'red' : 'black'
      }
    }, 'hello react.js')
  }
}
module.exports = App
```
在 `App` 组件中，我们渲染一段文本，并且添加交互：点击文本的话，文本会在黑、红两种颜色间切换。另外，你可能发现我没有用 JSX，也没有用 `import`、`export` 等 ES201X 的特性，这是为了减少 `webpack` 配置。

现在，我们需要 `webpack` 来打包 `index.js` 文件。

首先安装 `webpack`：

```bash
$ yarn add webpack webpack-cli --dev
```
接着运行 `webpack`：

```bash
$ npx webpack
Hash: b5f624c522379171503b
Version: webpack 4.0.0
Time: 1568ms
Built at: 2018-2-24 12:19:02
  Asset      Size  Chunks             Chunk Names
main.js  97.1 KiB       0  [emitted]  main
Entrypoint main = main.js
   [4] ./src/App.js 461 bytes {0} [built]
  [16] ./src/index.js 173 bytes {0} [built]
    + 15 hidden modules

WARNING in configuration
The 'mode' option has not been set. Set 'mode' option to 'development' or 'production' to enable defaults for this environment.
```
咦？都不用指定输出位置？也不用写 `webpack.config.js` 配置文件了？

是的，这是 webpack 4 里做出的许多改进 - 入口文件、输出文件都均有默认值，并且引入一个 `mode` 参数 - 默认使用 `production`。因为我们现在是开发阶段，所以给上面的命令附加 `development` 模式：

```bash
$ npx webpack --mode development
```

现在访问 `index.html`，我们就能看到客户端渲染出的内容了。

所以，服务器端要如何渲染 React.js 组件呢？

### 搭建 Node.js 服务器

我们需要服务器端语言 Node.js。

我们来写个最简单的 Node.js 服务器程序。

在 `react-server-render` 目录下新建一个 `index.js` 文件：

```js
const http = require('http')
const server = http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.write('hello react.js')
  response.end()
})
server.listen(4200)
console.log('Server is listening')
```
执行 `node index.js`，我们就能在 `http://localhost:4200` 访问页面 - 看到写死的 `hello react.js`。

那要如何返回 html 文件？

也很简单，我们读取 html 文件并返回即可：

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const server = http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  fs.createReadStream(path.join(__dirname, 'index.html')).pipe(response)
})
server.listen(4200)
console.log('Server is listening')
```
但上面的代码有一个问题，就是所有的请求都会返回 `index.html` 的内容，不管它是 `/` 还是 `dist/main.js`。我们需要优化上面的代码，区分不同的请求：

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const server = http.createServer(function (request, response) {
  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(response)
  } else {
    if (/\.js/.test(request.url)) {
      // js file
      response.writeHead(200, { 'Content-Type': 'application/javascript' })
      fs.createReadStream(path.join(__dirname, `${request.url}`)).pipe(response)
    } else {
      response.writeHead(404)
      response.end()
    }
  }
})
server.listen(4200)
console.log('Server is listening')
```
好了，我们成功运行一个 Node.js 应用，它能够返回 html 文件，也能返回 JavaScript 文件。当然，大部分时候我们不需要写原生的 Node.js 代码，而是使用 Express.js 等成熟框架。

### ReactDOMServer

我们前面手写的 Node.js 服务器读取了 html 文件并返回，同理，我们可以返回服务器端渲染的 React 代码。

我们要用到 `ReactDOMServer` 提供的 [`renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring)。

先尝试返回 `renderToString` 的结果看看：

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const ReactDOMServer = require('react-dom/server')
const React = require('react')
const App = require('./src/App.js')
const server = http.createServer(function (request, response) {
  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(ReactDOMServer.renderToString(React.createElement(App)))
    response.end()
  } else {
    if (/\.js/.test(request.url)) {
      // js file
      response.writeHead(200, { 'Content-Type': 'application/javascript' })
      fs.createReadStream(path.join(__dirname, `${request.url}`)).pipe(response)
    } else {
      response.writeHead(404)
      response.end()
    }
  }
})
server.listen(4200)
console.log('Server is listening')
```
重启 `node index.js`，然后查看 html 页面源代码：

```html
<div style="color:black" data-reactroot="">hello react.js</div>
```
显然，现在点击文字的话，不会切换颜色 - 因为现在还只是一个 `div` 块，没有引用任何脚本。

我们需要一个完整的 html。让我们重构下前面的 Node.js 代码：

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const ReactDOMServer = require('react-dom/server')
const React = require('react')
const App = require('./src/App.js')
function genHTML (body) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>React 服务器端渲染</title>
  </head>
  <body>
    <div id="root">${body}</div>
    <script src="dist/main.js"></script>
  </body>
  </html>
  `
}
const server = http.createServer(function (request, response) {
  if (request.url === '/') {
    let body = ReactDOMServer.renderToString(React.createElement(App))
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(genHTML(body))
    response.end()
  } else {
    if (/\.js/.test(request.url)) {
      // js file
      response.writeHead(200, { 'Content-Type': 'application/javascript' })
      fs.createReadStream(path.join(__dirname, `${request.url}`)).pipe(response)
    } else {
      response.writeHead(404)
      response.end()
    }
  }
})
server.listen(4200)
console.log('Server is listening')
```
重新运行 `node index`，页面的源代码已经变成：

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>React 服务器端渲染</title>
  </head>
  <body>
    <div id="root"><div style="color:black" data-reactroot="">hello react.js</div></div>
    <script src="dist/main.js"></script>
  </body>
  </html>
```
这么简单？？？？是的，就这么简单。

不过，查看浏览器的 console 面板，我们会看到如下警告：

> Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17. Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.

React 16 里引入 [ReactDOM.hydrate() 方法](https://reactjs.org/docs/react-dom.html#hydrate)，用于在服务器端渲染的场景中替代 `ReactDOM.render()`。如果你想了解 `render` 与 `hydrate` 的区别，可以查看 [StackOverflow](https://stackoverflow.com/a/46516869/1077489) 以及 [hydrate() 接口的 pull request 说明](https://github.com/facebook/react/pull/10339)。

因此我们需要调整下 `src/index.js`：

```js
const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')
ReactDOM.hydrate(React.createElement(App), document.getElementById('root'))
```
重新打包代码：

```bash
$ npx webpack --mode development
```
完工。

如果你想运行上述示例，可以访问 [Github 上 react-server-render 仓库](https://github.com/chenxsan/react-server-render)。

## 又及

如果你觉得 React.js 的服务器端渲染简单，很遗憾，并非如此。上面为了解释服务器端渲染删减许多细节，展示的只是冰山一角。在真正的应用里，我们还有 CSS、图片等等需要处理，比如在 `webpack` 中我们可以 `import 'index.css'`，在 Node.js 中是不行的，需要我们额外处理。

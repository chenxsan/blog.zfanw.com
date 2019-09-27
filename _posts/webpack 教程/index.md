---
title: webpack 4 教程
author: 陈三
date: 2015-08-28T13:19:03+00:00
dateModified: 2018-12-08
excerpt: webpack 是什么，应用在哪些场景，怎么用。webpack 4 里引入了哪些变化，对我们有什么影响。
permalink: /webpack-tutorial
toc: true
tags:
  - webpack
  - 教程
---

> 本教程基于 webpack 4，babel 7，最近更新于 2019-09-02

你需要 webpack 吗？

1. 如果你的代码不需要模块化，那么你**不需要 webpack**；
2. 如果你的代码需要模块化，那么你**可能需要 webpack**，因为还有其它选择；
3. 如果你的代码里，JavaScript、图片、CSS、JSON 等文件都要模块化，那么你**九成需要 webpack**。

## webpack 是什么

[**webpack** 官网](https://webpack.js.org/)是这样描述 webpack 的：

> webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

什么是模块？我们首先会想到 JavaScript 的 ES2015 模块、AMD 模块，又或 CommonJS 模块。

只不过在 webpack 下，所有资源文件（assets）都可以是模块，包括 JavaScript、 CSS、图片、JSON 等等。

我们当然知道，在 JavaScript 里 `import` 图片会报错。但在 webpack 下，这没有问题。这要归功于**加载器**（loader）。通过加载器，webpack 将 JavaScript 的模块化普及至其它文件类型 - 这正是 webpack 跨出的与众不同的一步 - 但也导致它配置繁多，广受诟病。

但明白 webpack 这一用意，我们就掌握了 webpack 核心，接下来，查查文档，你也可以成为 webpack 配置工程师。

## 从零开始手写 React.js 项目

我在这里草拟一个[简单的 React.js 单页面应用](./demo/index.html)，页面上有一张图片，点击图片，图片会旋转，再次点击图片则恢复原来的位置。

下面我们从零开始，用 webpack 搭建一个 React.js 开发环境，逐步完成编码、打包、部署。

### 初始化项目

首先，我们来初始化项目：

```bash
$ cd ~
$ mkdir -p tmp/webpack-demo && cd tmp/webpack-demo
$ npm init -y
```
项目初始化完成后，`webpack-demo` 目录下多出 `package.json` 文件，文件内容如下：

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
### 新建 HTML

接着，在 `webpack-demo` 目录下新建 `index.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack 教程</title>
</head>
<body>
  
</body>
</html>
```
`index.html` 暂时只有一个骨架。

### 创建 JavaScript 文件

再接着，在 `webpack-demo` 目录下新建 `index.js`，内容暂时留空。

因为我们要写 react 项目，就需要安装 `react` 及 `react-dom`：

```bash
$ npm install react react-dom
```
安装完成后，在 `index.js` 文件中 `import` 它们：

```js
import React from 'react'
import ReactDOM from 'react-dom'
```
好了，现在在 `index.html` 中引用 `index.js`：

```html
 <body>
+   <script src="index.js"></script>
 </body>
```
接着在浏览器中打开 `index.html`，不出意外，console 下报错，只是不同浏览器下报的错不一样：

1. Firefox 59.0.2: SyntaxError: import declarations may only appear at top level of a module
2. Safari 11.0.3: SyntaxError: Unexpected identifier 'React'. import call expects exactly one argument.
3. Chrome 65.0.3325.181: Uncaught SyntaxError: Unexpected identifier

这是因为，浏览器还不认识 `import` 语法。

因此我们要用 webpack 来构建我们的源代码 - webpack 将调用 [babelJS](https://blog.zfanw.com/babel-js/) 预处理我们的 JavaScript 代码。

### 安装 webpack

在 `webpack-demo` 项目根目录中安装 `webpack`：

```bash
$ npm install -D webpack
```
安装完成后，我们就会看到当前安装的 webpack 版本号。

### 编译 JavaScript

我们前面说，webpack 是个打包工具，那么它就需要一个入口文件，一个输出文件。

我们试试在命令行下将 `index.js` 打包成 `build.min.js`：

```
$ npx webpack ./index.js -o build.min.js
One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:
 - webpack-cli (https://github.com/webpack/webpack-cli)
   The original webpack full-featured CLI.
We will use "npm" to install the CLI via "npm install -D".
Do you want to install 'webpack-cli' (yes/no):
```
命令没有执行，提示我们安装一个命令行工具 `webpack-cli`，这是因为 webpack 4 里将命令行相关代码迁移出去了。

输入 `yes` 然后回车，稍等一会儿，`webpack-cli` 就安装好，随后打包命令会继续执行，结果如下：

```
Hash: c6f2777800799b280104
Version: webpack 4.27.1
Time: 1570ms
Built at: 2018-12-08 09:31:31
       Asset     Size  Chunks             Chunk Names
build.min.js  108 KiB       0  [emitted]  main
Entrypoint main = build.min.js
[2] ./index.js 59 bytes {0} [built]
[8] (webpack)/buildin/global.js 472 bytes {0} [built]
    + 7 hidden modules

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
```
打包成功，但有一个黄色警告。这是因为 webpack 4 引入了模式（mode），它有 `development`、`production`、`none` 三个值，我们不指定值时，默认使用 `production`。

我们来调整下命令：

```
$ npx webpack ./index.js -o build.min.js --mode development
```
不再出现黄色警告。

你可能会好奇，不指定输入、输出文件的话会怎样？

我们来试试：

```
$ npx webpack --mode development

Insufficient number of arguments or no entry found.
Alternatively, run 'webpack(-cli) --help' for usage info.

Hash: 98c6995d1c18cdca857e
Version: webpack 4.27.1
Time: 40ms
Built at: 2018-12-08 09:33:02

ERROR in Entry module not found: Error: Can't resolve './src' in '/Users/sam/tmp/webpack-demo'
```
报错，说在 `./src` 下找不到 `index.js` 文件 - 我们不指定输入文件时，webpack 会默认查找 `src/index.js` - 这也是 webpack 4 引入的一个约定。我们且按约定将项目根目录下的 `index.js` 移动到 `src/index.js`：

```bash
$ mkdir src
$ mv index.js src
```
然后再打包一遍：

```bash
$ npx webpack --mode development
Hash: a4fc30cbb3f1072af39f
Version: webpack 4.27.1
Time: 336ms
Built at: 2018-12-08 09:33:49
  Asset     Size  Chunks             Chunk Names
main.js  837 KiB    main  [emitted]  main
Entrypoint main = main.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./src/index.js] 59 bytes {main} [built]
    + 11 hidden modules
```
打包成功。但打包出来的是 `dist/main.js` - 这同样是 webpack 4 加入的约定，用户未指定输出文件时默认输出到 `dist/main.js`。

那么我们且将 `index.html` 中对 JavaScript 引用调整为编译后的 `dist/main.js`：

```html
 <body>
-  <script src="./index.js"></script>
+  <script src="dist/main.js"></script>
 </body>
```
再刷新浏览器，控制台已经不再报错。

### 实时刷新

在 `index.html` 文件中引用构建出的 `main.js` 文件后，我们有几个问题需要解决。

1. 入口文件 `src/index.js` 的变化如何通知给 webpack，以便重新构建 `dist/main.js` 文件？
2. `dist/main.js` 文件更新后，浏览器中打开的页面该如何自动刷新？

#### 监控文件

第一个问题，webpack 有好几个解决办法，其中 `watch` 选项最直观，我们可以让 `webpack` 监控文件变化，一旦文件有变化，就重新构建。但默认情况下，`watch` 选项是禁用的。

我们可以在命令行下启用它：

```bash
$ npx webpack --mode development --watch

webpack is watching the files…

Hash: a4fc30cbb3f1072af39f
Version: webpack 4.27.1
Time: 355ms
Built at: 2018-12-08 09:35:54
  Asset     Size  Chunks             Chunk Names
main.js  837 KiB    main  [emitted]  main
Entrypoint main = main.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./src/index.js] 59 bytes {main} [built]
    + 11 hidden modules
```

我们试试在 `index.js` 文件中添加一行 `console.log('hello webpack')`，保存文件后就会看到命令行下的变化：

```bash
Hash: be282f283f2de23db721
Version: webpack 4.27.1
Time: 22ms
Built at: 2018-12-08 09:36:12
  Asset     Size  Chunks             Chunk Names
main.js  837 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 88 bytes {main} [built]
    + 12 hidden modules
```
webpack 监控到 `src/index.js` 文件的变化，重新构建 `dist/main.js`，耗时 16ms。

#### 刷新浏览器

至于自动刷新浏览器的问题，webpack 提供 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 来解决，它是一个基于 expressjs 的开发服务器，提供实时刷新浏览器页面的功能。

### webpack-dev-server

首先在项目下安装 `webpack-dev-server`：

```bash
$ npm install -D webpack-dev-server
```
安装完成后在命令行下执行 `webpack-dev-server`：

```bash
$ npx webpack-dev-server --mode development
ℹ ｢wds｣: Project is running at http://localhost:8080/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wdm｣: Hash: 58d99b2a1be044182335
Version: webpack 4.27.1
Time: 507ms
Built at: 2018-12-08 09:47:10
  Asset      Size  Chunks             Chunk Names
main.js  1.15 MiB    main  [emitted]  main
Entrypoint main = main.js
[0] multi (webpack)-dev-server/client?http://localhost:8080 ./src 40 bytes {main} [built]
[./node_modules/ansi-html/index.js] 4.16 KiB {main} [built]
[./node_modules/events/events.js] 8.13 KiB {main} [built]
[./node_modules/html-entities/index.js] 231 bytes {main} [built]
[./node_modules/loglevel/lib/loglevel.js] 7.68 KiB {main} [built]
[./node_modules/react-dom/index.js] 1.33 KiB {main} [built]
[./node_modules/react/index.js] 190 bytes {main} [built]
[./node_modules/url/url.js] 22.8 KiB {main} [built]
[./node_modules/webpack-dev-server/client/index.js?http://localhost:8080] (webpack)-dev-server/client?http://localhost:8080 7.78 KiB {main} [built]
[./node_modules/webpack-dev-server/client/overlay.js] (webpack)-dev-server/client/overlay.js 3.58 KiB {main} [built]
[./node_modules/webpack-dev-server/client/socket.js] (webpack)-dev-server/client/socket.js 1.05 KiB {main} [built]
[./node_modules/webpack-dev-server/node_modules/strip-ansi/index.js] (webpack)-dev-server/node_modules/strip-ansi/index.js 161 bytes {main} [built]
[./node_modules/webpack/hot sync ^\.\/log$] (webpack)/hot sync nonrecursive ^\.\/log$ 170 bytes {main} [built]
[./node_modules/webpack/hot/emitter.js] (webpack)/hot/emitter.js 75 bytes {main} [built]
[./src/index.js] 134 bytes {main} [built]
    + 22 hidden modules
ℹ ｢wdm｣: Compiled successfully.
```
Ooops，令人晕眩的输出结果。

不过且忽视它们，我们现在可以在 http://localhost:8080/ 访问我们的 `index.html`。

在入口文件 `src/index.js` 里再添加一行代码验证下浏览器页面的实时刷新功能：

```js
console.log('webpack live reload is working')
```
观察命令行，我们可以看到，`webpack-dev-server` 重新构建 `main.js` - 换句话说，webpack-dev-server 自动启用 `--watch` 效果，前面的 `npx webpack --mode development --watch` 命令可以停用。

但是，浏览器中打开的页面并未自动刷新。我们可以查看 http://localhost:8080/dist/main.js 的代码，并没有 `console.log('webpack live reload is working')` 一句。问题在哪？

我们回头去看一下 `webpack-dev-server` 的输出：

> ℹ ｢wds｣: webpack output is served from /

是了，`webpack-dev-server` 监控到文件变化并重新构建 `main.js`，但这个新构建的 `main.js` 存在于内存中，未曾写入硬盘，而且它的默认路径是 `/main.js`，不是 `dist/main.js`。

我们有两个选择，一是调整 `publicPath`，二是调整 `index.html` 中的引用。

我选择后者：

```js
-   <script src="dist/main.js"></script>
+   <script src="main.js"></script>
```

### 编码

完成上述准备工作后，清理掉两个 `console.log` 代码，在 `src/index.js` 中新增如下代码：

```js
 import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOM from 'react-dom'
-console.log('hello webpack')
-console.log('webpack live reload is working')
+ReactDOM.render(<div>hello webpack</div>, document.body)
```
注意，React 不推荐使用 `body`，这里只是图方便才这么写。

查看命令行下的状态：

```
ERROR in ./src/index.js 3:16
Module parse failed: Unexpected token (3:16)
You may need an appropriate loader to handle this file type.
| import React from 'react'
| import ReactDOM from 'react-dom'
> ReactDOM.render(<div>hello webpack</div>, document.body)
|
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src main[1]
ℹ ｢wdm｣: Failed to compile.
```
出师不利，报错了。为什么？因为我们写 JSX 语法，webpack 不认识。怎么办，找加载器 babel-loader 来翻译。

```bash
$ npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react
```
在 webpack-dev-server 下，我们可以通过 `--module-bind` 参数来指定 js 语言的加载器：

```bash
$ npx webpack-dev-server --mode development --module-bind js=babel-loader?presets[]=@babel/preset-env,presets[]=@babel/preset-react
```
好了，命令行不再报错。

但你可能已经发现，这样配置命令行枯燥无味且容易出错 - 这便是 webpack 配置文件的作用了。

#### webpack 配置文件

来新建一个 `webpack.config.js` 文件：

```js
const path = require('path')
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  }
}
```
我们在配置文件中指定了 js 文件的加载器，重启 webpack-dev-server，它会自动读取 `webpack.config.js` 配置。命令行不再报错，浏览器页面渲染出 “hello webpack”。

### 图片加载器

我们需要一张图片，我从 unsplash 找来一张玫瑰，放到 `src/img/rose.jpg` 位置。

我们在 `src/index.js` 中 `import` 它：

```js
 import ReactDOM from 'react-dom'
+import Rose from './img/rose.jpg'
 ReactDOM.render(<div>hello webpack</div>, document.body)
```
不出意外，又报错了：

```bash
RROR in ./src/img/rose.jpg 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle thisfile type.
(Source code omitted for this binary file)
 @ ./src/index.js 3:0-34
 @ multi (webpack)-dev-server/client?http://localhost:8081 ./src
ℹ ｢wdm｣: Failed to compile.
```
和处理 JSX 一个道理，我们需要图片加载器。

在 webpack 里，负责加载图片的是 [file-loader](https://github.com/webpack-contrib/file-loader)：

```bash
$ npm install -D file-loader
```

接着是配置 `webpack.config.js`：

```json
+      },
+      {
+        test: /\.(png|jpg|gif)$/,
+        use: [
+          {
+            loader: 'file-loader',
+            options: {}
+          }
+        ]
       }
     ]
```
重启 webpack-dev-server，发现 webpack 已经能正常编译了 - 图片摇身一变，也是一个模块。

而且，webpack 在最终构建时，会自动将模块中引用的图片拷贝到相应目录 - 谢天谢地，再也不用手动拷贝静态资源。

确保图片加载没问题后，我们来完善下代码：

```js
-ReactDOM.render(<div>hello webpack</div>, document.body)
+class App extends React.Component {
+  render () {
+    return (
+      <div><img src={Rose} alt='玫瑰' /></div>
+    )
+  }
+}
+ReactDOM.render(<App />, document.body)
```
查看浏览器，图片已经渲染出来 - 但是图片太大了。我们需要 CSS 来控制图片尺寸。

### 加载 CSS 文件

在 React.js 里，CSS 有很多种写法，比如我们可以直接写在 `style` 中：

```html
<img src={Rose} alt='玫瑰' style={{maxWidth: 500}} />
```
因为这就是 JavaScript，我们也就不需要额外处理。

但我们也可以写在 css 文件中。

在 `src` 下新增 `index.css`：

```css
.flower {
  max-width: 500px;
}
```
然后在 `index.js` 中引入并应用：

```js
 import React from 'react'
 import ReactDOM from 'react-dom'
 import Rose from './img/rose.jpg'
+import './index.css'
 class App extends React.Component {
   render () {
     return (
-      <div><img src={Rose} alt='玫瑰' /></div>
+      <div><img src={Rose} alt='玫瑰' className='flower' /></div>
     )
   }
 }
```
但命令行下又报错了：

```bash
ERROR in ./src/index.css 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle thisfile type.
> .flower {
|   max-width: 500px;
| }
 @ ./src/index.js 4:0-21
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src
ℹ ｢wdm｣: Failed to compile
```
这回我们需要 CSS 加载器：

1. [css-loader](https://github.com/webpack-contrib/css-loader) - 预处理 CSS 文件
2. [style-loader](https://github.com/webpack-contrib/style-loader) - 将 CSS 插入到 DOM 中的 `style` 标签

注意，我们如果只使用了 css-loader，则 webpack 只是将 CSS 文件预处理成模块然后打包到构建文件中，并不会插入到页面 - 这是 `style-loader` 的作用。

我们先来安装它们：

```bash
$ npm install -D css-loader style-loader
```

然后修改 `webpack.config.js` 配置：

```js
+      },
+      {
+        test: /\.css$/,
+        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
       }
     ]
   }
```

请注意，loader 的顺序很重要，比如上面新增的这一节，如果把 `style-loader` 放到 `css-loader` 后面，我们就会撞见错误：

```
ERROR in ./index.css
Module build failed: Unknown word (5:1)

  3 | // load the styles
  4 | var content = require("!!./index.css");
> 5 | if(typeof content === 'string') content = [[module.id, content, '']];
    | ^
  6 | // Prepare cssTransformation
  7 | var transform;
  8 |
```

因为 `style-loader` 无法理解 CSS 文件，需要先经 `css-loader` 预处理 - 是的，加载器的执行顺序是从后往前的。

重启 webpack-dev-server，编译正常，css 已生效。

但是，这里的 CSS 虽然是 `import` 进来的，但仍是全局的，等效于我们平常使用 `<link href="" />` 引用 CSS。webpack 还提供 [CSS Modules](https://github.com/webpack-contrib/css-loader#modules)，可以将样式真正意义上的模块化。

除了 CSS Modules 外，我们还有很多 [CSS in js](https://github.com/MicheleBertoli/css-in-js) 方案可选，它们允许我们将样式跟 HTML、JS 放到一起 - 如果你写过 Vue.js 的单文件模块，可能会很喜欢。

在成功配置图片与 CSS 后，我们可以继续完善代码：

`src/index.css`：

```css
+}
+.flower--rotate {
+  transform: rotate(30deg);
 }
```

`src/index.js`：

```js
 class App extends React.Component {
+  state = {
+    reset: 'yes'
+  }
+  onClick = () => {
+    this.setState({
+      reset: this.state.reset === 'yes' ? 'no' : 'yes'
+    })
+  }
   render () {
     return (
-      <div><img src={Rose} alt='玫瑰' className='flower' /></div>
+      <div><img src={Rose} alt='玫瑰' className={this.state.reset === 'yes' ? 'flower' : 'flower flower--rotate'} onClick={this.onClick} /></div>
     )
   }
 }
```
但 webpack-dev-server 又抛出错误：

```bash
ERROR in ./src/index.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: /Users/sam/tmp/webpack-demo/src/index.js: Support for the experimental syntax 'classProperties' isn't currently enabled (6:11):

  4 | import './index.css'
  5 | class App extends React.Component {
> 6 |     state = {
    |           ^
  7 |       reset: 'yes'
  8 |     }
  9 |     onClick = () => {

Add @babel/plugin-proposal-class-properties (https://git.io/vb4SL) to the 'plugins' section of yourBabel config to enable transformation.
    at _class.raise (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:4028:15)
    at _class.expectPlugin (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:5364:18)
    at _class.parseClassProperty (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8469:12)
    at _class.pushClassProperty (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8433:30)
    at _class.parseClassMemberWithIsStatic (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8372:14)
    at _class.parseClassMember (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8309:10)
    at /Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8263:16
    at _class.withTopicForbiddingContext (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:7402:14)
    at _class.parseClassBody (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8238:10)
    at _class.parseClass (/Users/sam/tmp/webpack-demo/node_modules/@babel/parser/lib/index.js:8209:10)
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src main[1]
ℹ ｢wdm｣: Failed to compile.
```
这是因为我用了 JavaScript 的新特性 - 需要 `@babel/plugin-proposal-class-properties` 插件的支持。

首先是安装该插件：

```bash
$ npm install -D @babel/plugin-proposal-class-properties
```
然后调整 `webpack.config.js` 配置：

```js
         options: {
-          presets: ['@babel/preset-react']
+          presets: ['@babel/preset-react'],
+          plugins: ['@babel/plugin-proposal-class-properties']
         }
       },
```
重启 webpack-dev-server，编译正常。

查看浏览器，图片已经可以点击。

### 打包

在完成项目开发后，我们需要输出文件给生产环境部署，执行：

```bash
$ npx webpack --mode production
```

就可以打包出所有静态资源。

但这里有一个注意事项，所有静态资源是打包到 `dist` 目录的，而 `index.html` 是在根目录。在部署时，我们需要手动将 `index.html` 拷入 `dist` 目录。

### 清理 dist

随着某些文件的增删，我们的 `dist` 目录下可能产生一些不再使用的静态资源，我们不想这些旧文件也部署到生产环境上占用空间，所以在 webpack 打包前最好能清理 `dist` 目录。

我们来试试 [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)。

首先是安装：

```bash
$ npm install -D clean-webpack-plugin
```
然后在 `webpack.config.js` 中调用：

```js
 const path = require('path')
+const CleanWebpackPlugin = require('clean-webpack-plugin')
 module.exports = {
   mode: 'development',
+  plugins: [
+    new CleanWebpackPlugin(['dist'])
+  ],
   module: {
```

### html-webpack-plugin

前面提到，我们在部署时，需要将 `index.html` 拷入 `dist` 目录，这其实很不方便，而且容易遗漏。另外，这个简单项目里我们只引用 `main.js`，如果入口文件多起来，文件名中再加上 hash 的话，手动管理 index.html 的成本非常高。

我们可以借助 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)，自动生成 `index.html`。

首先是安装：

```bash
$ npm install --save-dev html-webpack-plugin
```
然后调整 `webpack.config.js`：

```js
 const CleanWebpackPlugin = require('clean-webpack-plugin')
+const HtmlWebpackPlugin = require('html-webpack-plugin')
 module.exports = {
   mode: 'development',
   plugins: [
-    new CleanWebpackPlugin(['dist'])
+    new CleanWebpackPlugin(['dist']),
+    new HtmlWebpackPlugin()
   ],
```
接着删掉项目下的 `index.html`，并重启 webpack-dev-server。查看浏览器页面，能够正常访问，但 title 却是 `Webpack App`，再调整一下 `webpack.config.js`：

```js
   plugins: [
     new CleanWebpackPlugin(['dist']),
-    new HtmlWebpackPlugin()
+    new HtmlWebpackPlugin({
+      title: 'webpack 教程'
+    })
   ],
```
最后再试试打包 `npx webpack --mode production`：

```bash
npx webpack --mode production
clean-webpack-plugin: /Users/sam/tmp/webpack-demo/dist has been removed.
Hash: 603991850e8d8a6d437b
Version: webpack 4.27.1
Time: 2381ms
Built at: 2018-12-08 10:19:08
                               Asset       Size  Chunks                    Chunk Names
17f86d1c4bf821d9b9e8bfb0ec35bc8d.jpg   1.01 MiB       [emitted]  [big]
                          index.html  180 bytes       [emitted]
                             main.js    116 KiB    0  [emitted]         main
Entrypoint main = main.js
 [3] ./src/img/rose.jpg 82 bytes {0} [built]
 [4] ./src/index.js 3.63 KiB {0} [built]
 [9] (webpack)/buildin/global.js 472 bytes {0} [built]
[10] ./src/index.css 1.06 KiB {0} [built]
[11] ./node_modules/css-loader/dist/cjs.js!./src/index.css 223 bytes {0} [built]
    + 10 hidden modules

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  17f86d1c4bf821d9b9e8bfb0ec35bc8d.jpg (1.01 MiB)

WARNING in webpack performance recommendations:
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [2] (webpack)/buildin/global.js 472 bytes {0}[built]
    [3] (webpack)/buildin/module.js 497 bytes {0}[built]
        + 2 hidden modules
```

Cool，`dist` 目录下啥都有了，我们不再需要部署前手动拷贝 `index.html`。

## 脚手架

前面的步骤里，我们几乎是一步、一步手动配置每个类型文件的加载器，一次添加一小节配置，然后重启 `webpack-dev-server`，有时还需要手动刷新页面，恐怕没人喜欢这样干活。因此市面上有非常多的 boilerplates、presets 等，其中比较出名的有：

1. [create-react-app](https://github.com/facebookincubator/create-react-app/) react 官方出品的一套，只适用开发 react.js 项目；
2. [neutrino.js](https://neutrino.js.org/) 这是 Mozilla 出品的一套解决方案，Web、React、Node.js 等方案均有。

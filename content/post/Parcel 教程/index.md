---
title: Parcel 教程？不需要。
date: 2018-12-24
permalink: /parcel-bundler-tutorial
tags:
  - 教程
  - webpack
  - Parcel
---

是不是觉得 [webpack 配置过程](https://blog.zfanw.com/webpack-tutorial/)非常痛苦？

我是说，我们开发一个项目，更应该关心项目本身，而不是项目开发环境的搭建、配置、维护 - webpack 虽妙（万物皆可模块化），但配置繁多，常常让人抓耳挠腮。

有痛苦的地方，就会产生新的解决方案。然后我们就有了各种基于 webpack 的零配置方案，比如 [create-react-app](https://github.com/facebook/create-react-app)，又或 [vue-cli](https://cli.vuejs.org)。相比 webpack，它们给我们的体验简直是如沐春风。

那么，同属零配置阵营的 [Parcel](https://parceljs.org) 又如何？

## Parcel 初体验

假设我要在 `parcel-react` 目录下新建一个 React 单页面应用。

先来初始化目录：

```
$ mkdir parcel-react
$ cd parcel-react
$ npm init -y
```

初始化完成后，第一个映入我们脑海的，当然是一个 html 文件。我们需要一个 `index.html`：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Parcel</title>
  </head>
  <body></body>
</html>
```

然后，我们还需要一个入口文件 `index.js`。我们将它加入 `index.html` 中：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Parcel</title>
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

接下来安装 `react` 及 `react-dom` - 注意，Parcel 是零配置，不是零安装，所以该装的依赖我们还是要装的：

```
$ npm install react react-dom
```

安装完成后在 `index.js` 中添加代码：

```js
import React from 'react'
import { render } from 'react-dom'
render(<div>hello react</div>, document.body)
```

之后再安装 Parcel：

```
$ npm install parcel-bundler -D
```

然后执行 `npx parcel index.html` 来启动开发服务器：

```
$ npx parcel index.html
Server running at http://localhost:50909 - configured port 1234 could not be used.
✨  Built in 3.13s.
```

接着在浏览器中打开该网址 - 一切顺利，我们看到文字了。

是的，在 Parcel 下，我们不需要像 webpack 那样安装 `babel-loader`、配置 `.babelrc` 才能编译 JSX 语法。

那么 CSS 又如何？我们知道 webpack 下可以通过 `css-loader` 与 `style-loader` 加载 CSS 的。

我们来试试。

在项目下添加 `index.css`：

```
.container {
  color: blue;
}
```

然后调整 `index.js` 代码：

```js
import React from 'react'
import { render } from 'react-dom'
import './index.css'
render(<div className="container">hello react</div>, document.body)
```

保存，页面自动刷新，文字已经变成蓝色。

那图片呢？和 CSS 一样，我们只管 `import`/`require`，不需要额外任何的配置。

## 构建

至于最后的构建，也不过就一行命令：

```
$ npx parcel build index.html
```

Parcel 打包出了 JavaScript、CSS、图片，当然，还有我们的 `index.html`：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Parcel</title>
    <link rel="stylesheet" href="/parcel-react.4bf54ac4.css" />
  </head>
  <body>
    <script src="/parcel-react.e00c84ee.js"></script>
  </body>
</html>
```

与前面的 `index.html` 做个比较：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Parcel</title>
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

Parcel 自动插入构建后的 CSS、JavaScript，这一切都不需要我们配置。

是了，这就是为什么我在标题里说，Parcel 不需要教程 - 都零配置了，还需要什么教程？

## 孰优孰劣

[2017 年末](https://medium.com/@devongovett/announcing-parcel-a-blazing-fast-zero-configuration-web-application-bundler-feac43aac0f1)，Parcel 就出来了，但我迟迟没有上手。直到最近，才终于在某个项目里试用它，与 webpack 对比，显然 Parcel 的体验要远胜 webpack。实际上，webpack 自 4.0 起，也大量引入默认配置项，减少用户配置工作，不妨认为，Parcel 是 webpack 的未来方向。但 webpack 的生态毕竟要更丰富，就我个人在实际项目中的使用情况，还有些 webpack 插件（配置）能做而 Parcel 零配置做不到的事情。当然，假以时日，Parcel 或许也能与 webpack 平起平坐 - 我十分期望那一天的到来。
---
title: babel 7 教程
date: 2016-01-01T10:25:05+00:00
dateModified: 2018-8-29
permalink: /babel-js
tags:
  - Babel.js
  - 前端开发
  - 教程
---

在前端开发领域，浏览器兼容性问题来来去去，不曾消失过。除了 CSS，我们还要面对 JavaScript 的兼容性问题：你用了 JavaScript 的 A 特性，能够在 B 浏览器上正常运行，却在 C 浏览器的 D 版本上报错。

这正是 Babel.js 想解决的问题。也因此，Babel 项目非常庞大，而且在不断更新、调整，这意味着，一篇教程不可能囊括所有 - 当然，我也没那种打算。

本文基于 babel 7.0.0。

## @babel/cli

[`@babel/cli`](https://babeljs.io/docs/en/babel-cli/) 是 babel 提供的命令行工具，用于命令行下**编译**源代码。

这里假定我们已通过 `npm init` 初始化项目。

首先，在项目中安装 `@babel/cli`：

```bash
npm install --save-dev @babel/core @babel/cli
```
如果你用过 babel 6，可能要问，怎么不是 `npm install --save-dev babel-cli`？`@` 符号又是什么？这是 babel 7 的一大调整，原来的 `babel-xx` 包统一迁移到[babel 域下](https://docs.npmjs.com/misc/scope) - 域由 `@` 符号来标识，一来便于区别官方与非官方的包，二来避免可能的包命名冲突。

现在假定我们的项目下有一个 `script.js` 文件，内容是：

```js
let fun = () => console.log('hello babel.js')
```
我们试试运行 `npx babel script.js`：

```bash
$ npx babel script.js
let fun = () => console.log('hello babel.js');
```
还是原来的代码，没有任何变化。说好的编译呢？

这个调整则是在 [babel 6](https://babeljs.io/blog/2015/10/29/6.0.0) 里发生的。Babel 6 做了大量模块化的工作，将原来集成一体的各种编译功能分离出去，独立成插件。这意味着，默认情况下，当下版本的 babel 不会编译代码。

## babel 插件

换句话说，我们要将上面的箭头函数编译成 ES5 函数，需要安装额外的 babel 插件。

首先，安装 [@babel/plugin-transform-arrow-functions](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-arrow-functions)：

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions
```
然后，在命令行编译时指定使用该插件：

```bash
$ npx babel script.js --plugins @babel/plugin-transform-arrow-functions
let fun = function () {
  return console.log('hello babel.js');
};
```
编译成功。

## 配置文件 .babelrc

随着各种新插件的加入，我们的命令行参数会越来越长。

这时，我们可以新建一个 `.babelrc` 文件，把各种命令行参数统一到其中。

比如，要配置前面提到过的箭头函数插件：

```json
{
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}
```
之后，在命令行只要运行 `npx babel script.js` 即可，babel 会自动读取 `.babelrc` 里的配置并应用到编译中：

```bash
$ npx babel script.js
let fun = function () {
  return console.log('hello babel.js');
};
```

## babel 套餐

我们有一个项目，页面要求支持 IE 10，但 IE 10 不支持箭头函数、`class` 及 `const`，可是你喜欢用这些新增的 JavaScript 语法，你在项目里写了这么一段代码：

```js
const alertMe = (msg) => {
  window.alert(msg)
}
class Robot {
  constructor (msg) {
    this.message = msg
  }
  say () {
    alertMe(this.message)
  }
}
const marvin = new Robot('hello babel')

```
显然，在 IE 10 下这段代码报错了。

好消息是，babel 有各种插件满足你的上述需求。

我们来安装相应插件：

```bash
$ npm install --save-dev @babel/plugin-transform-arrow-functions @babel/plugin-transform-block-scoping @babel/plugin-transform-classes
```
接着，将它们加入 `.babelrc` 配置文件中：

```json
{
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-classes"
    ]
}
```
然后运行 `npx babel script.js`，就有编译结果了：

```js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var alertMe = function (msg) {
  window.alert(msg);
};

var Robot =
/*#__PURE__*/
function () {
  function Robot(msg) {
    _classCallCheck(this, Robot);

    this.message = msg;
  }

  _createClass(Robot, [{
    key: "say",
    value: function say() {
      alertMe(this.message);
    }
  }]);

  return Robot;
}();

var marvin = new Robot('hello babel'); 
```
只是，这样安装插件、配置 `.babelrc` 的过程非常乏味，而且容易出错。通常，我们不会关心到具体的某个 ES2015 特性支持情况这个层面，我们更关心浏览器版本这个层面。

你说，我不想关心 babel 插件的配置，我只希望，给 babel 一个**我想支持 IE 10** 的提示，babel 就帮我编译出能在 IE 10 上正常运行的 JavaScript 代码。

欢迎 [@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/)。

等等，Preset 是什么？前面我们已经认识了插件，那么不妨把 Preset 理解为套餐，每个套餐里打包了不同的插件，这样安装套餐就等于一次性安装各类 babel 插件。

我们来看看怎样使用 `@babel/preset-env`。

首先在项目下安装：

```bash
$ npm install --save-dev @babel/preset-env
```
然后修改 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"]
}
```
运行 `npx babel script.js`，输出结果如下：

```js
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var alertMe = function alertMe(msg) {
  window.alert(msg);
};

var Robot =
/*#__PURE__*/
function () {
  function Robot(msg) {
    _classCallCheck(this, Robot);

    this.message = msg;
  }

  _createClass(Robot, [{
    key: "say",
    value: function say() {
      alertMe(this.message);
    }
  }]);

  return Robot;
}();

var marvin = new Robot('hello babel');
```
Wow，与前面辛苦配置各种插件后的输出结果几乎一模一样。

可是，我们还没告诉 babel 我们要支持 IE 10 的，为什么它却好像预知一切？

我们来看 `babel-preset-env` 的一段文档：

> Without any configuration options, babel-preset-env behaves exactly the same as babel-preset-latest (or babel-preset-es2015, babel-preset-es2016, and babel-preset-es2017 together).

默认情况下，`babel-preset-env` 等效于三个套餐，而不巧我们前面安装的几个插件已经囊括在 `babel-preset-es2015` 中。

那么，如果我只想支持最新版本的 Chrome 呢？

这时我们可以调整 `.babelrc` 的配置：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 1 Chrome versions"]
      }
    }]
  ]
}
```
再次编译，结果如下：

```bash
$ npx babel script.js
"use strict";

const alertMe = msg => {
  window.alert(msg);
};

class Robot {
  constructor(msg) {
    this.message = msg;
  }

  say() {
    alertMe(this.message);
  }

}

const marvin = new Robot('hello babel');
```
最新版本的 Chrome 已经支持箭头函数、`class`、`const`，所以 babel 在编译过程中，不会编译它们。这也是为什么我把 `@babel/preset-env` 称为 JavaScript 的 **Autoprefixer**。

## babel-polyfill

> Babel includes a polyfill that includes a custom [regenerator runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) and [core-js](https://github.com/zloirock/core-js).

基本上，babel-polyfill 就是 `regenerator runtime` 加 `core-js`。

可是，为什么需要 polyfill 这所谓的垫片？前面聊到 `@babel/preset-env` 时，不是说只要定义好我想支持的目标浏览器，babel 就能编译出能运行在目标浏览器上的代码吗？

我们暂时去掉 `babel-`，从 polyfill 说起。

拿 `findIndex` 来说，IE 11 仍不支持该方法，假如你的代码里写了 `findIndex`，IE 11 浏览器会报如下错误：

```console
Object doesn't support property or method 'findIndex'
```
怎么办，这时我们就可以写个 [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill)：

```js
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}
```
上面这段代码的意思是，如果目标环境中已经存在 `findIndex`，我们什么都不做，如果没有，我们就在 `Array` 的原型中定义一个。这便是 polyfill 的意义。babel-polyfill 同理。

虽说浏览器的特性支持状况千差万别，但其实可以提炼出两类：

1. 大家都有，只是 A 语法与 B 语法的区别；
2. 不是大家都有：有的有，有的没有。

babel 编译过程处理第一种情况 - 统一语法的形态，通常是高版本语法编译成低版本的，比如 ES6 语法编译成 ES5 或 ES3。而 babel-polyfill 处理第二种情况 - 让目标浏览器支持所有特性，不管它是全局的，还是原型的，或是其它。这样，通过 babel-polyfill，不同浏览器在特性支持上就站到同一起跑线。

下面我们看看 babel-polyfill 的用法。

### 安装 babel-polyfill

```bash
$ npm install --save @babel/polyfill
```
### 使用 babel-polyfill

我们需要在程序入口文件的顶部引用 `@babel-polyfill`：

```js
require('@babel/polyfill')
[].findIndex('babel')
```
或者使用 ES6 的写法：

```js
import '@babel/polyfill'
[].findIndex('babel')
```
需要注意的是，babel-polyfill 不能多次引用。如果我们的代码中有多个 `require('@babel/polyfill')`，则执行时会报告错误：

```console
only one instance of @babel/polyfill is allowed
```
这是因为引入的 babel-polyfill 会在全局写入一个 [`_babelPolyfill` 变量](https://github.com/babel/babel/blob/master/packages/babel-polyfill/src/index.js#L19)。第二次引入时，会检测该变量是否已存在，如果已存在，则抛出错误。

### 注意事项

如前面所说的，babel-polyfill 其实包含 `regenerator runtime`、`core-js`，如果你的代码只需要其中一部分 polyfill，那么你可以考虑直接引入 `core-js` 下的特定 polyfill，不必使用 babel-polyfill 这样的庞然大物。

另一种办法，是配合 `@babel/preset-env` 的 [`useBuiltIns`](https://babeljs.io/docs/en/next/babel-preset-env.html#usebuiltins) 配置。

## babel-runtime

`@babel/runtime` 是 babel 生态里最让人困惑的一个包。而在 babel 7 下，我们还多了一个 `@babel/runtime-corejs2`。

我们先来看看 `@babel/runtime` 的 `package.json` 里的 [`description`](https://github.com/babel/babel/blob/master/packages/babel-runtime/package.json#L4) 怎么写：

> babel's modular runtime helpers

有点不知所谓。

不过从 `package.json` 里没有 `main` 字段我们可以看出，它的用法肯定不是 `require('babel-runtime')` 这样。

那么，babel-runtime 与 babel-polyfill 的区别究竟是什么？

我们拿 `Object.assign` 为例，剖析下 babel-polyfill 与 babel-runtime 的异同。

我们知道，IE 11 不支持 `Object.assign`，此时，我们有俩种候选方案：

1. 引入 babel-polyfill，补丁一打，`Object.assign` 就被创造出来
2. 配置 [`@babel/plugin-transform-object-assign`](https://babeljs.io/docs/plugins/transform-object-assign/)

第二种方案中，babel 会将所有的 `Object.assign` 替换成 `_extends` 这样一个辅助函数。如下所示：

```js
Object.assign({}, {})
```
编译成：

```js
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

_extends({}, {});
```
问题是，如果你的项目里有 100 个文件，其中有 50 个文件里写了 `Object.assign`，那么，坏消息来了，`_extends` 辅助函数会出现 50 次。

怎么办？我们自然而然会想到把 `_extends` 分离出去，然后在每个文件中引入 - 这正是 `@babel/runtime` 的作用：

```js
var _extends = require("@babel/runtime/helpers/extends");

_extends({}, {});
```
非常漂亮。可没人想要手动转换这些代码。

于是 babel 提供了 [`@babel/plugin-transform-runtime`](https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/README.md) 来替我们做这些转换。

### @babel/plugin-transform-runtime

我们首先安装插件：

```bash
$ npm install --save-dev @babel/plugin-transform-runtime
```
然后再安装 babel-runtime：

```bash
$ npm install @babel/runtime
```
最后在 `.babelrc` 中配置：

```json
{
  "plugins": [
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-transform-runtime"
  ]
}
```
这样，我们不需要 babel-polyfill 也一样可以在程序中使用 `Object.assign`，编译后的代码最终能够正常运行在 IE 11 下。

> **提问**：在经过 `@babel/plugin-transform-runtime` 的处理后，IE 11 下现在有 `Object.assign` 吗？

答案是，仍然没有。

这正是 babel-polyfill 与 babel-runtime 的一大区别，前者改造目标浏览器，让你的浏览器拥有本来不支持的特性；后者改造你的代码，让你的代码能在所有目标浏览器上运行，但不改造浏览器。

如果你还是困惑，我推荐一个非常简单的区分方法 - 打开浏览器开发者工具，在 console 里执行代码：

1. 引入 babel-polyfill 后的 IE 11，你可以在 console 下执行 `Object.assign({}, {})`
2. 而引入 babel-runtime 后的 IE 11，仍然提示你：`Object doesn't support property or method 'assign'`

## babel-register

经过 babel 的编译后，我们的源代码与运行在生产下的代码是不一样的。

[babel-register](http://babeljs.io/docs/usage/babel-register/) 则提供了动态编译。换句话说，我们的源代码能够真正运行在生产环境下，不需要 babel 编译这一环节。

我们先在项目下安装 babel-register：

```bash
$ npm install --save-dev @babel/register
```
然后在入口文件中 `require`：

```js
require('@babel/register')
require('./app')
```
在入口文件头部引入 `@babel/register` 后，我们的 `app` 文件中即可使用任意 es2015 的特性。

当然，坏处是动态编译，导致程序在速度、性能上有所损耗。

## babel-node

我们上面说，babel-register 提供动态编译，能够让我们的源代码真正运行在生产环境下 - 但其实不然，我们仍需要做部分调整，比如新增一个入口文件，并在该文件中 `require('@babel/register')`。而 babel-node 能真正做到一行源代码都不需要调整：

```bash
$ npm install --save-dev @babel/core @babel/node
$ npx babel-node app.js
```
只是，请不要在生产环境中使用 babel-node，因为它是动态编译源代码，应用启动速度非常慢。

## babel 7 迁移指南

如果你需要从旧版本 babel 迁移到 babel 7，那么，请参照官方的 [babel 7 升级指南](https://babeljs.io/docs/en/v7-migration)。
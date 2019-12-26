---
title: 从 jQuery 到 React
date: 2019/11/01
permalink: /from-jquery-to-react
tags:
  - jQuery
  - React.js
---

## 一个计数器案例

假设有一个计数器按钮，它显示的初始值是 0，每次点击，显示数值都会加 1：

```html
<button id="counter">0</button>
```

<button id='counter'>0</button>

<script src="jquery.min.js"></script>

<script>
$('#counter').on('click', function () {
  $(this).html($(this).html() * 1 + 1)
})
</script>

如果我们用 jQuery，代码大概会是这样：

```js
$('#counter').on('click', function() {
  $(this).html($(this).html() * 1 + 1)
})
```

上面的代码其实有三个步骤：

1. 点击发生时，我们从按钮文本中读取当前状态值：

   ```js
   $(this).html() * 1
   ```

2. 计算新状态值
3. 更新 HTML：

   ```js
   $(this).html($(this).html() * 1 + 1)
   ```

我们来改写下 jQuery 代码，以便更清晰地看到整个流程：

```js
// 获取当前状态值
var currentCounter = $(this).html() * 1
// 计算新状态值
var nextCounter = currentCounter + 1
// 更新 HTML
$(this).html(nextCounter)
```

如果改用 React，我们的代码大致是这样写：

```js
// react hooks 版
function Counter() {
  const [counter, setCounter] = useState(0)
  return <button onClick={() => setCounter(counter + 1)}>{counter}</button>
}
```

那么，相比之下，React 优于 jQuery 的地方是哪些？为什么当下整个前端的趋势是从 jQuery 迁移到 React 等等框架的？

## 更新 HTML

对比 jQuery 与 React 的代码，我们可以看到，二者都需要获取当前状态值，也都需要计算新的状态值。但是在 jQuery 下，我们是这样更新 HTML：

```js
$(this).html(nextCounter)
```

而 React 代码里，我们的 HTML 是个 JSX 模板，

```js
<button>{counter}</button>
```

我们只要设定新状态值，React 就会帮我们填充数据。

如果说 HTML 显现的是应用程序最新的状态，则我们的页面其实不过是在 N 个状态间切换。jQuery 下我们需要负责这一切换过程，而 React 下我们只负责描述这 N 个应用状态，React 负责状态切换。

当然，React 的做法是有代价的，在 React 下，我们所有的 HTML（包括初次渲染）现在都由 JavaScript 生成，也因此为了应付 SEO 等需求，React 等框架常常还要引入[服务器端渲染](https://blog.zfanw.com/react-js-server-render/)。而在 jQuery 中，初次渲染的 HTML 是静态 HTML 文件，并不需要额外的服务器端渲染。

## 组件化

组件化的好处，就毋庸赘述了。确切说，组件化才是 React 等框架真正的威力所在，通过组件的组合，我们可以构建出极其复杂的单页面应用，而在 jQuery 下，那恐怕会是一个耗时且费力的工程。

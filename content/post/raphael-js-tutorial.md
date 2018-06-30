---
title: Raphael.js 教程
date: 2013-06-20T16:12:06+00:00
permalink: /raphael-js-tutorial
tags:
  - Raphael.js
---

这是一篇写于 2013 年的文章，而时间已经来到 2018。

我们可以从 [Raphael 的 Github](https://github.com/DmitryBaranovskiy/raphael/releases) 了解到，Raphael.js 最近一次更新是在 2016.11.12，版本号 2.2.7 - 这不禁让人担心它的未来。

我们看它最新的教程，会发现近年来前端工具的发展似乎与它毫无关系。教程中仍然推荐使用 `script` 或 AMD 规范引用它，没有提到 webpack，也没有 browserify。

而且它的浏览器兼容列表中仍然有 IE 6 - 站在 2018 来看，会觉得匪夷所思。

不过，是否继续选择 Raphael，还是留给真正有需求的人去决定。

## 引用 raphael

两种方式：

1. 古老的 `script` 标签：

    ```html
    <script src="raphael.js"></script>
    ```

2. AMD 规范的加载方式，通常指 [require.js](http://requirejs.org/)：

    ```js
    define([ "path/to/raphael" ], function( Raphael ) {
      console.log( Raphael )
    });
    ```

## 用法

在加载 raphael 后，我们得到一个 `Raphael` 方法。

借助 `Raphael` 方法，我们可以在指定坐标创建一个画布，比如：

```js
// 在浏览器窗口中，坐标 (10, 50) 位置创建一个画布，长 320px，宽 200px。
var paper = Raphael(10, 50, 320, 200)
```
我们随后的操作都将在这块画布上 - 注意，这里虽然叫画布，但并不是 Canvas，Raphael 生成的其实是一块 SVG 区域。

### 绘制基本图形

给你一张 A4 纸，让你画一个半径 50cm 的红色太阳，你会怎么画？

首先，你会找一个中心点，然后配合圆规，画出一个圆，最后涂红色。

Raphael 下绘制圆的原理基本也是一样：

```js
// 在 (50, 100) 的坐标点上，绘制一个半径为 50px 的圆
var circle = paper.circle(50, 100, 50)
// 给圆填充红色
circle.attr({"fill":"red"})
```

除了圆，Raphael.js 还提供其他常规图形的绘制方法，比如方形([rect](http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.rect))、椭圆([ellipse](http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.ellipse))、路径([path](http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.path))等。

另外，Raphael 方法还可以在 HTML 元素中创建画布：

```html
<div id="raphael"></div>
<script>
    //在 id 为 raphael 元素中创建画布
    var paper = Raphael("raphael", 320, 200);
    var circle = paper.circle(100, 100, 50);
    circle.attr({"fill":"green"});
</script>
```
跟通过坐标创建的画布有什么区别？我们可以通过浏览器的开发者工具查看生成的画布的结构与样式。

通过坐标创建的画布的 CSS 样式是这样的：

```css
  overflow: hidden;
  position: absolute;
  left: 10px;
  top: 50px;
```
而通过元素创建的画布的 CSS 样式是这样的：

```css
  overflow: hidden;
  position: relative;
```
不难看出，前一种画布是绝对定位，后一种则是包含在 HTML 元素中。

### 修改对象属性

在画布上创建出 Raphael 对象后，我们可以修改它们的各种属性。

比如下面的代码，我们先通过 `text` 方法生成了文字，然后修改文字字号为 30px，填充蓝色，红色描边，调整透明度为 50%：

```js
<div id="raphael"></div>
<script>
  var paper = Raphael("raphael", 300, 300)
  var t = paper.text(150, 150, "Hello from 陈三")
  t.attr({"font-size":"30px","fill":"blue","stroke":"red","opacity":".5"})
</script>
```
这一切都是通过 [attr 方法](http://dmitrybaranovskiy.github.io/raphael/reference.html#Element.attr)完成。

<p data-height="265" data-theme-id="dark" data-slug-hash="xYZMJP" data-default-tab="js,result" data-user="chenxsan" data-embed-version="2" data-pen-title="raphael-attr" class="codepen">See the Pen <a href="https://codepen.io/chenxsan/pen/xYZMJP/">raphael-attr</a> by 陈三 (<a href="https://codepen.io/chenxsan">@chenxsan</a>).</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 变换对象

除了修改对象的属性，我们还可以变换([transform](http://dmitrybaranovskiy.github.io/raphael/reference.html#Element.transform))对象，比如平移、旋转、缩放。

Raphael 对象变换有四个命令：

1. t – translate，平移
2. r – rotate，旋转
3. s – scale，缩放
4. m – matrix

拿 `t100,100r45t-100,0s.5` 来说：

1. 对象水平方向平移 100
2. 垂直方向平移 100
3. 旋转 45 度
4. 水平方向往负方向平移 100
5. 缩小图形到原来的一半

### 动画效果

上面说到修改对象属性和变换对象，因为有开始和结束两个状态，我们就可以添加[动画效果](http://dmitrybaranovskiy.github.io/raphael/reference.html#Element.animate)。

如下：

```html
<div id="raphael"></div>
<script>
  var paper = Raphael("raphael", 400, 300)
  var circle = paper.circle(200, 150, 100)
  circle.attr({"fill":"red"})
  circle.animate({cx: 10, cy: 20, r: 8, "fill": "blue"}, 10e3)
</script>
```
圆心的初始坐标为 (200,130)，半径 100，填充红色，绘制完成后，圆心坐标调整为 (cx,cy)，即 (10,20)，半径缩为 8，填充蓝色，这个变化过程时长为 10e3 毫秒，即 10 秒。

<p data-height="265" data-theme-id="dark" data-slug-hash="gvPqKq" data-default-tab="js,result" data-user="chenxsan" data-embed-version="2" data-pen-title="raphael-animate" class="codepen">See the Pen <a href="https://codepen.io/chenxsan/pen/gvPqKq/">raphael-animate</a> by 陈三 (<a href="https://codepen.io/chenxsan">@chenxsan</a>).</p>

### 绑定事件

因为 Raphael.js 创建的图形均是 SVG，也是一种 DOM，这意味着，我们可以给它们绑定事件，比如单击、双击、拖动、鼠标移入、鼠标移出等。

举 [hover 方法](http://dmitrybaranovskiy.github.io/raphael/reference.html#Element.hover)为例：

```html
<div id="raphael"></div>
<script>
  var paper = Raphael("raphael", 400, 300)
  var circle = paper.circle(200, 150, 100)
  circle.attr({"fill":"red"})
  circle.hover(
    function(){circle.attr({"fill":"green"})},
    function(){circle.attr({"fill":"red"})}
  ) //给 circle 对象绑定 hover 事件
</script>
```
<p data-height="392" data-theme-id="dark" data-slug-hash="RQrvQY" data-default-tab="html,result" data-user="chenxsan" data-embed-version="2" data-pen-title="RQrvQY" class="codepen">See the Pen <a href="https://codepen.io/chenxsan/pen/RQrvQY/">raphael-hover</a> by 陈三 (<a href="https://codepen.io/chenxsan">@chenxsan</a>).</p>

上例中，鼠标浮动到圆上，填充色即变成绿色，移开则恢复成红色。

当然，以上内容只是入门，更多内容，还请查阅 [Raphael.js 官方文档](http://dmitrybaranovskiy.github.io/raphael/reference.html)。
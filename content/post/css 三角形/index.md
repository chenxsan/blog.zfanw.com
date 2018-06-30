---
title: CSS 三角形
date: 2013-05-28T05:05:07+00:00
permalink: /css-triangle
tags:
  - CSS
---

网页设计里，我们经常看到三角形箭头。比如一个下拉框，会有一个向下、一个向上的三角形箭头。大部分人遇到这样的设计，第一反应可能是将三角形部分切成 PNG 透明图片。但其实我们可以用 CSS 代码来绘制三角形。

来看一个示例：

<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    box-sizing: content-box;">
</div>

上面是一个长、宽均为 100px 的 div，黑色背景，顶部边框 50px 宽，红色。它的 HTML 代码如下：

```html
<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    box-sizing: content-box;">
</div>
```
我们增加一条 50px 的蓝色底部边框看看：

<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    border-bottom:50px solid blue;
    box-sizing: content-box;">
</div>

我想没有人对这样的显示效果有疑义。

再加一条绿色的右边框会怎样？

<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    border-bottom:50px solid blue;
    border-right:50px solid green;
    box-sizing: content-box;">
</div>

有意思的是，新增的右边框并不是长方形，而是梯形，它同时也影响与它相邻的上、下边框，导致它们从长方形变成直角梯形。

为什么会这样？

且假设新增的右边框是长方形，则我们会得到这样的样式：

<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    border-bottom:50px solid blue;position:relative;overflow:visible;
    box-sizing: content-box;">
    <div style="width:50px;height:100px;position:absolute;top:0;right:-50px;background:green;
    box-sizing: content-box;"></div>
</div>

又或者下面这种：

<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    border-bottom:50px solid blue;position:relative;overflow:visible;
    box-sizing: content-box;">
    <div style="width:50px;height:200px;position:absolute;top:-50px;right:-50px;background:green;
    box-sizing: content-box;"></div>
</div>

无论哪种长方形，效果都不理想。于是我们有了梯形这个选项，实际上，是两个边框可重叠部分沿对角线分割，各领一半，各上各色。不过很可惜，我没有找到任何相关的 CSS 规范或标准来佐证我的这个说法。

接下来，我们再给上面的 div 补上橙色左边框：

<div style="width:100px;
    height:100px;
    background-color:black;
    border-top:50px solid red;
    border-right:50px solid green;
    border-bottom:50px solid blue;
    border-left:50px solid orange;
    box-sizing: content-box;">
</div>

可以想像，缩减 div 块的宽 、高直到 0，我们的 div 会变成这样：

<div style="width:0;
    height:0;
    background-color:black;
    border-top:50px solid red;
    border-right:50px solid green;
    border-bottom:50px solid blue;
    border-left:50px solid orange;
    box-sizing: content-box;">
</div>

此时，CSS 三角形生成的方法就非常明了。

比如，我要用 CSS 实现向下箭头，则要不断减少下边框蓝色部分的宽度，直到 0 为止，

<video src="./css-triangle.mp4" controls width="200"><video>

最后将左、右边框的颜色设为透明：

<div style="width:0;
    height:0;
    background-color:none;
    border-left:50px solid transparent;
    border-right:50px solid transparent;
    border-bottom:none;
    border-top:50px solid red;
    box-sizing: content-box;">
</div>

代码如下：

```
<div style="width:0;
    height:0;
    background-color:none;
    border-left:50px solid transparent;
    border-right:50px solid transparent;
    border-bottom:none;
    border-top:50px solid red;
    box-sizing: content-box;">
</div>
```
其他方向的三角形箭头，向上，向左，或向右，同理均可以实现。

---
title: jQuery 给动态添加的元素绑定事件
date: 2013-01-01T06:17:15+00:00
permalink: /jquery-dynamic-insert-element-bind-event
tags:
  - jQuery
  - 前端开发
---

通常，jQuery 是这样给 HTML 元素绑定事件的：

```js
$('#clickMe').on('click', function () {
    alert("hey it's Sam.");
  }
);
```
事件绑定后，我们点击元素，浏览器就会弹一个对话框。

但是，上述事件绑定只适用页面内已有的元素。[jQuery `on` 文档](https://api.jquery.com/on/)里是这样说的：

> Event handlers are bound only to the currently selected elements; they must exist at the time your code makes the call to .on()

也就是说，如果上述 JavaScript 代码执行时，`#clickMe` 元素还不存在，是我们后期动态添加的话，则上述事件绑定不会生效 - jQuery 不能给不存在的 DOM 节点绑定事件处理器。

但我们可以把它委托（delegated）给 `document`：

```js
$(document).on('click', '#clickMe', function(){
  alert("hey it's Sam.");
});
```
Hey `document`，如果有点击事件发生，请让 `#clickMe` 执行这个事情处理器。

点击事件会冒泡，而 `document` 总是存在。这样，就达到我们希望的效果。

同理，你也可以将事件绑定委托给某些已存在的父节点。
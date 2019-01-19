---
title: JavaScript 正则表达式匹配字符串
date: 2012-12-12T04:31:04+00:00
dateModified: 2018-07-02
categories:
  - 前端开发
tags:
  - JavaScript
---

假设有一段文本：

> Today is 2018.07.02

我想提取所有英文单词。

在 JavaScript 下，这个正则表达式可以这么写：

```js
var re = /[a-zA-Z]+/g
```

我们执行 [String 对象的 `match` 方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)来提取匹配正则表达式的字符串：

```js
var allStr = str.match(re)
```

打印 `allStr` 数据：

```js
["Today", "is"]
```
成功匹配所有字符串，非常简单。
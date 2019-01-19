---
title: jQuery 自定义事件
date: 2014-01-24T16:08:15+00:00
permalink: /jquery-custom-event
categories:
  - 前端开发
tags:
  - jQuery

---

jQuery 中，事件处理器通常使用 `on` 来绑定，比如：

```js
$('.js-submit').on('click', function() {
  // 这里是 click 事件触发的行为
})
```

除开 `click` 这类浏览器内置的事件，我们还可以在 jQuery 中添加自定义事件。

比如我们可以写：

```js
$(document).on('talk.people', function() {
  // 这里是 talk.people 事件触发的行为
})
```

与前面的点击不一样的是，我们要通过代码触发该事件：

```js
$(document).trigger('talk.people')
```

可是，为什么要这么写？

举个例子。

一个按钮，点击后发起一个 ajax 请求向后端提交数据，数据提交成功后在页面上显示一条通知：

```js
$('.js-submit').on('click', function () {
  $.post(endpoint, {username: 'Sam Chen'}).done(resp => {
    window.alert('保存成功')
  })
})
```
然而我们有好几个地方有 `window.alert('保存成功')` 这段代码。

稍后我们也许想调整 `保存成功` 为 `恭喜！保存成功`，很明显，我们要改很多处。

此时我们可以借助 jQuery 的自定义事件，提取公用代码：

```js
// 自定义 success.ajax 事件
$(document).on('success.ajax', function () {
  window.alert('保存成功')
})
$('.js-submit').on('click', function () {
  $.post(endpoint, {username: 'Sam Chen'}).done(resp => {
    // 触发 success.ajax 事件
    $(document).trigger('success.ajax')
  })
})
$('.js-form').on('submit', function () {
  $(document).trigger('success.ajax')
})
```
这样，不管是后期的代码维护，或者代码扩展，都要方便很多 - 当然，如果没有类似上述的场景，倒也没有十分必要使用 jQuery 的自定义事件，很多时候，过度优化并不是件好事。
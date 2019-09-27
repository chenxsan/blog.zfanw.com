---
title: JavaScript 去弹跳
date: 2019/08/13
permalink: /JavaScript-debounce
tags:
  - JavaScript
---

页面上有一个保存按钮，点击它会向服务器发起一条 API 请求，保存当前表单的数据。

假如有用户恶意快速点击，比如 1 秒点 5 下 - 那么就会有 5 条 API 请求发生，其中 4 条是多余的。

一个很容易想到的解决办法是，推迟请求。

比如说，点击事件发生时，我们设定一个定时器，200ms 后发起请求：

```js
function APIRequest() {
  // API request here
}
document.getElementById('button').addEventListener('click', function() {
  setTimeout(() => {
    // 点击事件发生时，迟延 200ms 执行 APIRequest 函数
    APIRequest()
  }, 200)
})
```

当然，上面的代码很有问题，因为每一个点击都还是绑定一个计时器，假如我们快速点击 5 下，则 200ms 后 5 个定时器启动，依旧有 5 条请求，这不符合我们的预想。

我们应该在每个定时器创建时，检查是否已经启动过定时器，如果有，则清理已有的定时器：

```js
function APIRequest() {
  // API request here
}
var timer
document.getElementById('button').addEventListener('click', function() {
  if (timer) {
    // 如果定时器存在，则清理掉
    window.clearTimeout(timer)
  }
  // 设定定时器并保存在 timer 变量中
  timer = setTimeout(() => {
    APIRequest()
  }, 200)
})
```

现在，代码已经达到我们的目的了。不过我们可以提取代码以便复用：

```js
function APIRequest() {
  // API request here
}
// 定义 debounce（去弹跳）函数
// debounce 引申自 https://en.wikipedia.org/wiki/Switch#Contact_bounce
function debounce(func, timeout) {
  var timer // 这里的 timer 因为闭包会一直都存活着
  return function() {
    // debounce 执行后，返回一个函数，该函数能够获取 timer 变量
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func()
    }, timeout)
  }
}
// 事件绑定
document
  .getElementById('button')
  .addEventListener('click', debounce(APIRequest, 200))
```

不过上面的代码还不完善，因为 `debounce` 函数中的 `func` 在执行时，没有接收到任何参数 - 这里指 `click` 事件对象。

我们来改造下 `debounce`：

```js
function APIRequest(e) {
  // 现在我们能接收到 click 事件对象 e 了
}
function debounce(func, timeout) {
  var timer
  return function() {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(null, arguments) // func 执行时传递参数
    }, timeout)
  }
}
```

现在我们的 `APIRequest` 能够获取到事件对象了。

不过你可能知道，JavaScript 支持 `this` 来获取函数执行时的上下文，拿上面的示例中，理论上，`APIRequest` 函数中是应该能获取到 `this` - `#button` 元素的。然而我们的代码因为 `apply` 了 `null`，所以 `APIRequest` 中获取到的 `this` 会变成 `null`。

再来调整 `debounce` 函数：

```js
function APIRequest(e) {
  // 现在我们能接收到 `this` 了
}
function debounce(func, timeout) {
  var timer
  return function() {
    var context = this
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(context, arguments) // 指定 func 的执行上下文
    }, timeout)
  }
}
```

至些，我们的 `debounce` 已经非常完善，但还有个可用性问题。我们前面假定了用户恶意快速点击的情境而创建了 `debounce` 来推迟 API 请求，然而我们无差别惩罚了正常用户，他们的正常点击不应该被推迟。

我们可以在事件点击第一次发生时就执行 `APIRequest`，随后的 200ms 内如果再次发生点击，则可以认为是误点或是恶意点击。

我们来重写一个 `debounce_leading` 函数：

```js
function debounce_leading(func, timeout) {
  return function() {
    var context = this
    func.apply(context, arguments)
  }
}
```

当然，这个 `debounce_leading` 函数一无是处，它即时执行了我们的 `func`。

那么要如何保证 `func` 第一次执行后的 200ms 内不再执行 `func` 呢？

我们可以考虑引入一个变量：

```js
// 定义 debounce_leading（去弹跳）函数
function debounce_leading(func, timeout) {
  var run = false // func 是否能够运行的开关
  return function() {
    var context = this
    if (!run) {
      // 仅允许第一次时执行
      func.apply(context, arguments)
    }
    run = true // 第一次运行后，将 run 设定为 true
  }
}
```

当然，上面的代码也是有问题的，因为第一次点击发生后，`run` 变量一直都是 `true`，这意味着我们后面不管有没有隔着很长时间再点击，`func` 都不再执行。

怎么办？我们可以设定一个定时器，在 timeout 时间结束时重置 `run` 为 `false`，

```js
// 定义 debounce_leading（去弹跳）函数
function debounce_leading(func, timeout) {
  var run = false
  var timer // 定时器
  return function() {
    var context = this
    if (!run) {
      func.apply(context, arguments)
    }

    run = true

    timer = setTimeout(() => {
      // timeout 时间结束时将 run 重置为 false 以允许 func 再度执行
      run = false
    }, timeout)
  }
}
```

有问题么？有问题，我们如果连续点击 5 次，则有 5 个 `timer` 被创建，重复给 `timer` 赋值并不会取消已创建的定时器，我们依然需要检查 `timer` 值，看是否已创建定时器，如有，则取消掉，重新创建它：

```js
// 定义 debounce_leading（去弹跳）函数
function debounce_leading(func, timeout) {
  var run = false
  var timer // 定时器
  return function() {
    var context = this
    if (!run) {
      func.apply(context, arguments)
    }

    run = true
    if (timer) {
      // 检查 timer 是否已有，若有，则清理掉，并重新创建 - 这是对连续快速点击的惩罚
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // timeout 时间结束时将 run 重置为 false 以允许 func 再度执行
      run = false
    }, timeout)
  }
}
```

现在，我们的代码已经达到我们的目的了。接下来就是添加些[测试](https://github.com/chenxsan/debounce/tree/master/test)来验证代码的正确性，这里略过不表。

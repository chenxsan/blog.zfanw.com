---
title: React.js 懒加载
date: 2018-11-02
permalink: /reactjs-code-splitting-lazy-load
tags:
  - React.js
---

起初，我们把所有 JavaScript 文件打包塞进一个 `app.js` 中，但随着功能的增加，我们的 `app.js` 文件迅速增长，直到有一天，它长到 8M - 你非常清楚，这远不是终点。

一个很容易想到的解决办法是[代码分割](https://reactjs.org/docs/code-splitting.html) - 你可能还见过**懒加载**、**延迟加载**、**按需加载**等等说法。它的道理非常简单，我现在访问登录页，则没有必要同时加载设置页的代码，我可以在访问设置页的时候再加载它的代码 - 毕竟，我可能永远都不会用到设置页。

[动态 `import`](https://github.com/tc39/proposal-dynamic-import) 即为解决代码分割问题而来：

```js
import('./xx').then(xx => {
  // 这里我们得到了动态加载的模块
})
```

不过 [React 16.6.0](https://reactjs.org/blog/2018/10/23/react-v-16-6.html) 引入了 `React.lazy`，让我们分割起来更方便。

在 React 下，我们现在这样分割代码：

```js
import React, { lazy, Suspense } from 'react'

const OtherComponent = lazy(() =>
  import('./OtherComponent')
)

function MyComponent() {
  return (
    <Suspense fallback={<div>I'm loading...</div>}>
      <OtherComponent />
    </Suspense>
  )
}
```

为什么非得使用 `Suspense`？因为 `OtherComponent` 是异步加载的，`Suspense` 在它加载完成前，提供了一个 fallback 界面。当然，`Suspense` 有更多的应用场景，但那是[后话](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-16x-mid-2019-the-one-with-suspense-for-data-fetching)了。

除了 React 组件外，`lazy` 方法还可以懒加载路由、图片等资源 - 只要它是个模块。

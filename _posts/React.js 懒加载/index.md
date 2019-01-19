---
title: React.js 懒加载
date: 2018-11-02
permalink: /reactjs-code-splitting-lazy-load
tags:
  - React.js
---

起初，我们把所有 js 文件打包进一个 `app.js` 中，但随着功能的增加，我们的 `app.js` 文件迅速成长，直到有一天，它长到 2M - 你当然清楚，这还不是终点。

一个很容易想到的解决办法是，懒加载，或说延迟加载。譬如我现在进入登录页，为什么给我加载设置项的 js？并没有十分必要，你可以等我进入设置项的时候再加载这些 js。毕竟，我可能永远都不会用到设置项。

在 React 下，我一直在用 [react-loadable](https://github.com/jamiebuilds/react-loadable) 懒加载组件、路由，配合 Webpack 打包，很方便。但有一阵，该作者改了许可证。如果你用过 [lerna](https://github.com/lerna/lerna/)，你可能已经听说过 [lerna 改许可证风波](https://github.com/lerna/lerna/pull/1616)，也是 react-loadable 作者干的，当时整个前端界闹得沸沸扬扬。我虽然不在那些被禁用的公司上班，但心里还是发虚，觉得这样的项目精神不稳定，所以一直想找机会替掉它。

直到最近 [React 16.6.0 发布](https://reactjs.org/blog/2018/10/23/react-v-16-6.html)，引入了 `React.lazy` 与 `Suspense`。

在 react 16.6.0 下，我们这样进行代码分割与懒加载：

```js
import React, {lazy, Suspense} from 'react';
const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```
用法上，其实与 react-loadable 十分接近，唯一的不足是，暂时还不支持服务器端渲染。
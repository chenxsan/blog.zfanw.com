---
title: jsxstyle - CSS 命名很难
permalink: /jsxstyle
date: 2018-05-05
---

React.js 兴起后，CSS in JS 也雨后春笋般冒出来，甚至有人在 github 上建了[仓库](https://github.com/MicheleBertoli/css-in-js)，收集各种 CSS in JS 框架。

毫不意外，我在项目开发中试过几个框架。

最初是 aphrodite，因为功能比较完善，后来可能是觉得没什么特色，换成 styled-components，直到最近，又把 styled-components 换成 [jsxstyle](https://github.com/smyte/jsxstyle)。

简单做个分类，CSS in JS 可以分成两个类别。

一类还写我们熟悉的 CSS 语法，比如 styled-components：

```js
import React from 'react'
import styled from 'styled-components'
const Header = styled.header`
  color: #333;
  font-size: 3rem;
`
export default () => <Header>this is heading</Header>
```

另一类则不再写 CSS 语法，而要把 `font-size` 写成 `fontSize`，比如 jsxstyle：

```js
import React from 'react'
import { Block } from 'jsxstyle'
export default () => <Block component='header' color='#333' fontSize='3rem'>this is heading</Block>
```

那么，我放弃 styled-components，选择 jsxstyle，是否意味着我偏好 CSS 语法？

并不然，我没有偏好哪一种。在技术选型上，我是个实用主义者。

我最终选择 jsxstyle 的原因，是因为 CSS 命名很难 - 当然，命名一直很难，不是 CSS 独有。

在 styled-components 下，每一组样式，哪样只用一次，你也得命名一次，比如这样：

```js
import React from 'react'
import styled from 'styled-components'
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
export default () => <Title>this is title</Title>
```
jsxstyle 则根据 CSS 的 `display` 值定义了一些常见组件，比如 `Block` 组件对应 `display: block`，因此上面的 `Title` 我们可以这样写：

```js
import React from 'react'
import { Block } from 'jsxstyle'
export default () => <Block component='h1' fontSize='1.5em' textAlign='center' color='palevioletred'>this is title</Block>
```
你看，在 jsxstyle 里，我不用特地浪费一个 `Title` 名称。命名很难，你用掉 `Title` 以后，接着你就要写 `ArticleTile`，用掉 `ArticleTitle` 以后，接着你就要绞尽脑汁，最后想出 `ArticleMetaTitle` - 在 jsxstyle 下，这可以省掉。

当然，这并不是说 jsxstyle 可以完全避免命名难题，像[复用组件](https://github.com/smyte/jsxstyle/issues/113)时，我们不可避免还是要命名。但至少，不复用的组件里，我们不再需要命名。
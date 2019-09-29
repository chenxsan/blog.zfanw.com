---
title: BEM 命名规范的问题
date: 2019/09/27
permalink: /problems-of-bem-css-naming-convention
tags:
  - CSS
  - BEM
---

过去几年里，我多时在使用 React + CSS in JS 开发单页面应用，也就避开了 [CSS 的所谓架构问题](https://blog.zfanw.com/css-architecture/)。但最近又写了些静态页面，于是重拾 [BEM - Block、Element、Modifier](https://en.bem.info/)，密集使用后，就能感知到几个问题。

## 命名很难

《地海传奇》里，万物皆有**真名**。

编程也一样，我们要找出变量的真名 - 但这并不是易事。

如果你不甚用心，则你定义的 Block 很可能是一次性的，无法复用的；如果你很用心，想定义一个可供未来复用的 CSS 组件 - 很遗憾，你并不能预见未来，需求怎么改，设计稿怎么调整，都不是你能控制的，九成情况下，你十分用心命名出来的组件未来也是不可复用的。

然后你就破罐子破摔。

## Mix

BEM 的 Block 定义了组件，但组件与周边元素的边距等等属性，并不属于 Block 本身，在 BEM 下，它们是通过 [Mix](https://en.bem.info/methodology/quick-start/#mix) 来达成的：

```html
<!-- `header` block -->
<div class="header">
  <!--
        The `search-form` block is mixed with the `search-form` element
        from the `header` block
    -->
  <div class="search-form header__search-form"></div>
</div>
```

但多写几回 Mix 你就会发现，这些所谓 Mix（其实就是额外的 Block）多数时候是多余的，因为复用性极低 - 而我们却绞尽脑汁为它们命了名。

更好的办法，是定义一些 utility CSS，比如 `.mr-10`：

```
.mr-10 {
  margin-right: 10px;
}
```

让它们取代 Mix 的功能，`.mr-10` 的命名可远比 Mix 容易，另外 `.mr-10` 被复用的可能性也远比 Mix 更高。

## 开闭原则

[开闭原则](https://zh.wikipedia.org/zh-sg/%E5%BC%80%E9%97%AD%E5%8E%9F%E5%88%99)运用到 CSS 上，就是你定义好了一个 CSS 类，则**永远不要尝试修改它**。因为除非你检查整个代码库，否则你不知道它用在哪里 - 你的任何改动，都可能引起你并不想要的结果。

是的，我们被允许扩展它，在 BEM 下，我们通过 modifier 来扩展它。

比如一个 `.btn`：

```css
.btn {
  display: inline-block;
  font-size: 14px;
  line-height: 2;
  color: black;
  border: 1px solid gray;
  border-radius: 4px;
  padding-left: 12px;
  padding-right: 12px;
}
```

<style>
.btn {
  display: inline-block;
  font-size: 14px;
  line-height: 2;
  color: black;
  border: 1px solid gray;
  border-radius: 4px;
  padding-left: 12px;
  padding-right: 12px;
}
</style>

<div>
  <button class="btn">BEM</button>
</div>

我们希望它变大，就定义一个 modifier 来覆写它：

```css
.btn_size_large {
  font-size: 18px; // 覆盖 .btn 中的 font-size 规则
}
```

<style>
.btn_size_large {
  font-size: 18px;
}
</style>
<div>
  <button class="btn btn_size_large">BEM</button>
</div>

我们希望它变小，就定义另一个 modifier 来覆写它：

```css
.btn_size_small {
  font-size: 12px; // 覆盖 .btn 中的 font-size 规则
}
```

<style>
.btn_size_small {
  font-size: 12px;
}
</style>
<div>
  <button class="btn btn_size_small">BEM</button>
</div>

我们不想要圆角，就再定义一个 modifier 来覆写它：

```css
.btn_radius_none {
  border-radius: 0; // 覆盖 .btn 中的 border-radius 规则
}
```

<style>
.btn_radius_none {
  border-radius: 0;  // 覆盖 .btn 中的 border-raidus 规则
}
</style>
<div>
  <button class="btn btn_radius_none">BEM</button>
</div>

我们想要一个黑底白字效果，就再来一个 modifier：

```css
.btn_inverted {
  background: black; // 新增了 background 规则
  color: #fff; // 覆盖 .btn 中的 color 规则
}
```

<style>
.btn_inverted {
  background: black;
  color: #fff;
}
</style>
<div>
  <button class="btn btn_inverted">BEM</button>
</div>

一切看起来挺好。

不过，我们一直在覆盖 `.btn` 中定义的规则 - 这真的合适吗？毕竟，`.btn` 的 modifiers 怎么写，全看我们第一次写下的 `.btn` 规则，假如我们想要的按钮样式不幸竟与 `.btn` 完全相反，则我们可能要在 modifier 中覆写 `.btn` 所有的规则：

```css
.btn_wtf {
  font-size: 18px;
  line-height: 1.5;
  background: #03a9f4;
  color: #fff;
  border: none;
  border-radius: 0;
  padding-left: 24px;
  padding-right: 24px;
}
```

<div>
  <style>
  .btn_wtf {
    font-size: 18px;
    line-height: 1.5;
    background: #03a9f4;
    color: #fff;
    border: none;
    border-radius: 0;
    padding-left: 24px;
    padding-right: 24px;
  }
  </style>
  <button class="btn btn_wtf">BEM</button>
</div>

又或是继续新增 modifiers，直到它们能够拼合成我们想要的样式，比如：

```html
<button
  class="btn
  btn_size_large
  btn_radius_none
  btn_bg_blue
  btn_border_none
  ..."
>
  BEM
</button>
```

不管是哪一种方案，我们现在都会有一个疑问，`.btn` 的那一大段代码意义何在？

我们拿到设计稿，参照第一眼看到的按钮样式，把它写成 CSS 规则，并命名为 `.btn` 组件 - 这比动物将睁眼见到的第一个活物当成母亲还要荒唐。

我们的 `.btn` 太复杂了，复杂到我们后期所有的 modifier 都好像是在纠正最初犯下的错。

## 组合优于继承

我们从一开始，就不应该写出 `.btn`。那我们该怎么写？

从 `<button class="btn btn_size_large btn_radius_none btn_... btn_...">BEM</button>` 这一片段代码中我们可以得到启发。

先假设我们的 `.btn` 只是个空壳，然后我们再定义各种 modifiers - 这里，我们的 modifiers 不再覆盖 `.btn` 的规则，它们并行不悖：

```css
.btn {
}
.btn_inlineBlock {
  display: inline-block;
}
.btn_size_normal {
  font-size: 14px;
}
.btn_lineHeight_large {
  line-height: 2;
}
.btn_color_black {
  color: black;
}
.btn_border_1 {
  border: 1px solid gray;
}
.btn_radius_4 {
  border-radius: 4px;
}
.btn_padding_x {
  padding-left: 12px;
  padding-right: 12px;
}
```

接着在 HTML 中**组合**所有的 modifiers：

```html
<button
  class="
    btn_inlineBlock
    btn_size_normal
    btn_lineHeight_large
    btn_color_black
    btn_border_1
    btn_radius_4
    btn_padding_x"
>
  BEM
</button>
```

<div>
  <style>
  .btn_inlineBlock {
    display: inline-block;
  }
  .btn_size_normal {
    font-size: 14px;
  }
  .btn_lineHeight_large {
    line-height: 2;
  }
  .btn_color_black {
    color: black;
  }
  .btn_border_1 {
    border: 1px solid gray;
  }
  .btn_radius_4 {
    border-radius: 4px;
  }
  .btn_padding_x {
    padding-left: 12px;
    padding-right: 12px;
  }
  </style>
  <button class="btn_inlineBlock btn_size_normal btn_lineHeight_large btn_color_black btn_border_1 btn_radius_4 btn_padding_x">BEM</button>
</div>

对了，这正是 [utility first CSS](https://tailwindcss.com/) 的用法，区别仅在于写法有些不同。

增减 HTML 的 `class` 要远比修改 CSS 类的代码安全。而当我们将 CSS 代码简化到一行 - 通常我们就不再需要修改它了，有需要，我们就加一个 CSS 类。我们组合不同的 CSS 类，而非继承一个复杂的 CSS 类然后覆写它的规则。

## BEM 还需要吗？

注意，我们前面讲的是 utility first，并非 utility only，代码中如果确定出现了某种模式，则我们仍然可以应用 BEM 来抽象组件。
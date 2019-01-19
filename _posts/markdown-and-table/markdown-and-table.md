---
title: Markdown 表格语法
date: 2013-07-02T16:50:38+00:00
permalink: /markdown-and-table
tags:
  - markdown
---

[John Gruber 与 Aaron Swartz 协作开发的 markdown 版本](http://daringfireball.net/projects/markdown/syntax) 里，并没有提供表格语法，这意味着，我们要在该版本下写表格，只能插入 HTML 代码：

```html
<table>
    <tr>
        <td></td>
    </tr>
</table>
```

简洁的 Markdown 中插入这一堆 HTML 标签，多少有点刺眼，表格数据多的话，写起来也不方便。

一个解决办法，是使用扩展过的 Markdown 语法。

比如，我们可以在 [Github 网站使用以下格式的 markdown 表格](https://help.github.com/articles/organizing-information-with-tables/)：

```markdown
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```
它最终会转换成如下 HTML：

```html
<table>
  <thead>
    <tr>
      <th>First Header</th>
      <th>Second Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content Cell</td>
      <td>Content Cell</td>
    </tr>
    <tr>
      <td>Content Cell</td>
      <td>Content Cell</td>
    </tr>
  </tbody>
</table>
```
除了 Github 外，许多 markdown 转 html 工具也都支持上述 markdown 表格格式，比如：

1. [markdown-it](https://github.com/markdown-it/markdown-it#syntax-extensions)
2. [Pandoc](http://pandoc.org/try/?text=%7C+First+Header++%7C+Second+Header+%7C%0A%7C+-------------+%7C+-------------+%7C%0A%7C+Content+Cell++%7C+Content+Cell++%7C%0A%7C+Content+Cell++%7C+Content+Cell++%7C&from=markdown&to=html5)

不过，使用上述 markdown 表格格式过程中，你可能发现，这好像没比直接插入 `table` 快多少，而且还很容易犯错。毕竟，写 html 标签的话，我们通常也是用了 [Emmet 展开](https://blog.zfanw.com/zencoding-vim-tutorial-chinese/#x3-%E5%B1%95%E5%BC%80) - `table>(thead>tr>th*2)+(tbody>tr*2>td*2)`，不会一个一个标签打过去。

回想一下，我们在可视化编辑器里，通常都是点击几下按钮就插入表格的。

当然，在网页上实现这样一个 markdown 表格生成器非常容易。

<link href="./index.a23c5f6d0d70a5ff133ffe88447182db.css" rel="stylesheet">
<div id="root">
</div>
<script src="./runtime.f3f57d977d79f5fe68f6.js" type="text/javascript"></script>
<script src="./index.47462bd74e73d6108437.js" type="text/javascript"></script>

你只要填写要插入的表格的行数、列数，即可自动生成相应的 markdown 表格。
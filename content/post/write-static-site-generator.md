---
title: 静态网站生成器怎么写
permalink: /how-to-write-static-site-generator
date: 2018-05-08
---

最近在写一个[静态网站生成器](https://github.com/okmarvin/okmarvin)，于是有一点心得。

首先要弄明白三个问题：

1. 页面数据哪里来
2. 页面模板怎么确定
3. 页面的 Permalink 怎么确定

数据 + 模板 = 内容，而 Permalink 决定内容的写入位置。

## 页面数据

在静态网站中，我们可以把页面分成两种：

1. 简单数据，即实际存在硬盘或数据库中的数据体，比如一个 markdown 文件
2. 复合数据，实际上并不存在，而是根据第一种数据体组装出来的，比如主页，分类页，等等

所以页面数据来源有两种：

1. 从 markdown 文件/或其它文件、API 接口读取简单数据
2. 简单数据组装，形成复合数据

## 页面模板

我们可以通过 [front matter](https://jekyllrb.com/docs/frontmatter/) 指定当前页面要使用的模板，比如这样：

```yaml
---
template: post
---
```
当然，不是每个都需要指定模板，我们还可以通过文件路径来推导页面的模板，比如 `project_root/content/post` 下的文件均默认应用 `post` 模板，而 `project_root/content/page` 下的文件均默认应用 `page` 模板。

至于复合数据页面，比如主页、分类页，因为它们不存在目录、文件，我们也就无法通过文件路径获取它们的模板，这时可以考虑定义一些常量，比如 `index` 的模板为：

```js
['home', 'index']
```
静态网站生成器在处理时会先查找 `home` 模板，找不到则继续查找 `index` 模板，假如 `index` 模板不存在，抛出错误，停止渲染。

## Permalink

文件内容渲染完成后，要写到哪里？

与确定模板的方式一样，我们同样有两种方案，一种是在 front matter 里指定文件的 permalink：

```yaml
---
permalink: /:title
---
```
这里 `:title` 是个占位，后期处理时会用真实的 title 数据替代，当然我们也可以直接写固定的 permalink，比如：

```yaml
---
permalink: /jsxstyle-introduction
---
```
同模板一样，我们不必给每个文件都指定 permalink，未指定 permalink 的文件可以通过目录结构来推导，比如 `project_root/content/page/about/index.md` 文件的 permalink 默认为 `/about/index.html`。

## 总结

确认完以上几点，就可以开始编码，假以时日，就能写出一个静态网站生成器。
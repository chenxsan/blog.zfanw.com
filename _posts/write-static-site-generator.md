---
title: 静态网站生成器怎么写
permalink: /how-to-write-static-site-generator
date: 2018-05-08
---

最近在写一个[静态网站生成器](https://github.com/okmarvin/okmarvin)，于是有一点心得。

从最终生成的 HTML 页面倒溯，要弄清三个问题：

1. 页面数据
2. 页面模板
3. 页面 Permalink（或说 URL）

**数据** + **模板** = **HTML 代码**，而 Permalink 决定 HTML 代码最终存入哪个位置、哪个文件。

下面来分别说明。

## 页面数据

我们可以把页面数据分成两种：

1. 简单数据，即实际保存在硬盘（或者数据库）上的数据体，比如一个 markdown 文件
2. 复合数据，实际不存在，而是根据第一种数据体并结合一些全局的配置（如分页设置等）组装出来的，比如主页、分类页等等

大体上，页面数据包含：

1. 标题
2. 描述
3. 作者
4. 发布日期
5. 标签
6. 分类 etc.
7. 图片 - 是了，图片是一种特殊数据，它并不像其它数据一样内嵌在文件中，而是一种引用的形式，换句话说，我们最终要将它们拷入某个目录下，而不是写入某个文件中

## 页面模板

准备好每个页面的数据后，我们需要知道页面的模板 - 否则光秃秃的一串 JSON 数据，并不适合阅读。

我们可以通过 [front matter](https://jekyllrb.com/docs/frontmatter/) 在 markdown 文件中指定页面要使用的模板，比如这样：

```yaml
---
template: post
---

```

当然，我们还可以省事点，通过文件路径来推导页面的模板，比如 `project_root/content/post` 下的文件均默认使用 `post` 模板，而 `project_root/content/page` 下的文件则默认使用 `page` 模板。

至于复合数据页面，比如主页、分类页，因为它们不存在真实文件，也就无法通过文件路径或是 front matter 获取它们的模板，这时需要我们额外配置模板。

实际上，页面模板也是页面数据的一种。

## Permalink

有了数据，有了模板，也就有了最后的 HTML 代码，那么，要写到哪个位置哪个文件？

与确定模板的方式一样，我们同样有两种方案，一种是在 front matter 里指定文件的 permalink，比如：

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

当然，我们不必在 front matter 里给每个文件都指定 permalink。未指定 permalink 的文件可以通过目录结构来推导，比如 `project_root/content/page/about/index.md` 文件的 permalink 默认为 `/about/index.html`。

同理，Permalink 仍然是页面数据的一种。

## 开发

在确认完以上三种数据后，我们就可以开始开发 - 也就是收集数据。

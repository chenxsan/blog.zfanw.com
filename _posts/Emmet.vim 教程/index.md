---
title: Emmet.vim 教程
date: 2012-05-31T10:03:03+00:00
permalink: /zencoding-vim-tutorial-chinese
excerpt: Emmet.vim 插件在哪儿下载、如何安装，以及它的常见用法。
tags:
  - vim
  - zencoding.vim
  - emmet.vim

---

Emmet 项目原先叫 Zen Coding，2012 年改名为 Emmet。

Emmet 官方支持[很多编辑器](http://emmet.io/download/)，但 Vim 插件 [Emmet.vim](https://github.com/mattn/emmet-vim/) 不是并非官方支持的，它是日本 [Yasuhiro Matsumoto](http://mattn.kaoriya.net/) 开发。

## 下载 Emmet.vim

你可以从 [Vim 插件站点](http://www.vim.org/scripts/script.php?script_id=2981)下载最新压缩包。

## 安装 Emmet.vim

将下载的压缩包解压到用户主目录的 `.vim` 目录下即可：

```bash
cd ~/.vim
unzip /path/to/emmet-vim.zip
```

不过，我会推荐使用 [pathogen.vim](http://www.vim.org/scripts/script.php?script_id=2332)  或是 [Vundle](https://github.com/VundleVim/Vundle.vim) 来管理 Vim 插件，具体用法可以查看它们的文档。

## 使用 Emmet.vim

**说明**：本着废话少说（don't repeat yourself）的原则，下面的内容除非特别说明，**调用快捷键**均指按下 <**Ctrl-y**\>。

### 展开

Emmet 最大的意义，在于四两拨千斤：输入几个简短词组，调用快捷键，就可以输出我们想要的大块代码。

我们试试在 Vim 下输入 `div>p#foo$*3>a`，接着调用快捷键，再按 `,`：

```html
<div>
    <p id="foo1">
        <a href=""></a>
    </p>
    <p id="foo2">
        <a href=""></a>
    </p>
    <p id="foo3">
        <a href=""></a>
    </p>
</div>
```

Cool。`div`、`p`、`#foo`、`a` 以及 `>` 这些我们都认识，就是 CSS 选择器。那么 `$*3` 是什么？从展开结果我们可以猜出，`*3` 表示要输出三个 `p`，`$` 则表示自增长数字。更多说明可以查看 [Emmet 上的缩略语文档](https://docs.emmet.io/abbreviations/syntax/#abbreviations-syntax)。

### 包围

如下内容：

```html
    test1
    test2
    test3
```

首先定位到 `test1` 一行，然后按 `V` 进入 Vim 可视模式，再按 `3j` “行选取”三行内容，然后调用快捷键，并按 `,`，这时 Vim 的命令行会提示 `Tags:`，键入`ul>li*`，然后回车，结果如下：

```html
<ul>
    <li>test1</li>
    <li>test2</li>
    <li>test3</li>
</ul>
```

如果输入的 tag 是 `blockquote`，则会是以下结果：

```html
<blockquote>
    test1
    test2
    test3
</blockquote>
```

### 插入模式下根据光标位置选中整个标签

这个过程共两步：

1. 按 `i` 或 `a` 进入 Insert 模式
2. 按 <**Ctrl-y**\>，再按 d 键，选中光标所处的整个标签

具体操作可以看下方视频：

<video controls src='./balance-tag-inward.mp4'></video>

不过这里会有一个问题，光标的位置在哪里才算对？拿视频中的代码来说：

```html
<div>
        <ul>
                <li><a href="|"></a></li>
                <li><a href=""></a></li>
                <li><a href=""></a></li>
        </ul>
</div>
```
我们的光标是在 `|` 所处的位置。如果放到 `<|li>` 这里呢？你可以试试。

### 跳转到下一个编辑点

插入模式下调用快捷键，再按 `n` 键。

可是，什么是编辑点？仍拿上面的代码来标注：

```html
<div>
        <ul>
                <li><a href="|">|</a></li>
                <li><a href="|">|</a></li>
                <li><a href="|">|</a></li>
        </ul>
</div>
```
`|` 标注出我们的编辑点，通常是标签属性或标签的内容区域。

### 跳转到上一个编辑点

插入模式下调用快捷键，再按 `N`。

### 插入图片大小

移动光标到 img 标签。

```html
<img src="foo.png" />
```

然后调用快捷键，再按 `i`：

```html
<img src="foo.png" width="32" height="48" />
```

说明：仅适用本地图片，互联网上的图片无法取得其大小。

### 合并行

假设有这么一段代码：

```html
<ul>
  	<li class="list1"></li>
  	<li class="list2"></li>
  	<li class="list3"></li>
</ul>
```
我们想把三个 `li` 合并成一行。

1. 选中三行
2. 调用快捷键，再按 `m`

我们得到了：

```html
<ul>
  	<li class="list1"></li><li class="list2"></li><li class="list3"></li>
</ul>
```

### 移除标签对

如下代码：

```html
<div class="foo">
    <a>cursor is here</a>
</div>
```
光标移动到 `a` 标签内，然后在普通模式下调用快捷键并按 `k`，就会移除 a 标签对：

```html
<div class="foo">

</div>
```

再操作一次的话，则连 `div` 标签块都被移除。

### 注释

移动光标到块中

```html
<div>
    hello world
</div>
```

插入模式下调用调用快捷键并按 `/`，就会注释掉整个 `div`：

```html
<!-- <div>
    hello world
</div> -->
```

再次操作则会取消注释。

当然，你也可以在普通模式下操作。

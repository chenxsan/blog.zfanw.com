---
title: Vimperator 简介
author: 陈三
toc: true
permalink: /vimperator-introduction
date: 2011-01-01T15:55:13+00:00
excerpt: Vimperator 是什么，能做什么，有哪些特性，一目了然。
tags:
  - Vimperator
---

来自 2017 年 9 月的作者：

> 因为最近翻新博客，就重新整理了文章，这是现有的最早的一篇，写于 2011 年，可见我使用 Vimperator 的历史已经很长。记得最初着手翻译，是打算译完整个文档，希望最后能并入 Vimperator 官方的，但种种原因，不了了之，只剩下这几篇，帮我记起当初的热爱 - 当然，时至今日，我还是爱 Vimperator 的。

**注**：本文译自 [Vimperator 英文帮助](https://github.com/vimperator/vimperator-labs/blob/master/vimperator/locale/en-US/intro.xml)，部分内容未翻。

一开始，世上有 Navigator，然后才出现 Explorer，继而是 Konqueror 的时代，现在，该绝对统治者登场了，这独一无二的 VIMperator :)。

## Vimperator 简介

[Vimperator](http://vimperator.org/) 是一个 [Firefox 浏览器](http://www.mozilla.com/firefox/)扩展，它的大部分灵感都来自 Vim 编辑器。我们希望创造一个更快、更高效的冲浪环境。Vimperator 的键绑定与 Vim 类似，你不妨把它叫做**模式化 web 浏览器**，因为不同模式下，键绑定不一样。举个例子，它有个很特别的 Hint 模式，在 Hint 模式下，只要键盘，你就可以轻松操作链接。几乎所有的功能都有对应的命令，比如 `:back` 后退到上一个历史网页，就好像你点过工具栏上的后退按钮。

不过，Vimperator 不打算百分百复制 Vim，不如说，它是把 Vim 的思想带入 21 世纪。这意味着，充分利用新的图形处理能力，以及更快的计算能力。更进一步，我们费心打造它的命令行界面，让它们自洽、易用，同时还不失为高级用户的有力扩展。

Vimperator 不仅仅只是一个简单的 Firefox 命令界面，它同时也是一个完整的开发环境。如果你是 web 开发者，你就能享用一个可交互的 JavaScript 壳，甚至还支持补全呢。又或者你想扩展 Vimperator，要做的很简单，只要拖动 JavaScript 文件到 plugin 文件夹。

## 帮助列表

- Vimperator 快速入门教程：为新手提供的快速入门教程。
- 启动 Vimperator：Vimperator 如何启动，从哪儿读取的配置文件，等等。
- Web 浏览：Web 浏览需要的基本映射与命令（比如如何打开网页或后退）。
- Buffer：当前页面下的操作，如滚动或拷贝文件。
- 命令行模式：命令行模式编辑。
- 插入模式：插入模式编辑。
- 配置项：概述了所有的配置项。
- 文本搜索命令：在当前 buffer 内搜索文件。
- 标签页：管理标签页。
- Hints：选择超链接及其它页面元素。
- 键映射、缩略词及用户定义的命令：定义新的键映射、缩略词及用户命令。
- 表达式执行：执行 JavaScript。
- 标记：使用书签、快速标签、历史、本地标签。
- 重做命令：使用宏命令重做繁复的工作。
- 自动化命令：在某些事件发生时自动执行代码。
- 打印：打印页面。
- Vimperator 的图形用户界面：访问 Firefox 菜单、对话框及侧边栏。
- 样式化图形用户界面及页面：修改内容页及 Vimperator 本身样式。
- 错误及说明：消息与错误概述。
- 开发信息：如何编写文件或插件。
- 更多命令：其它不能列入上述任何分类的帮助。
- 插件：你可能安装的任何插件的文档。
- 索引：所有命令及配置项的索引。

你也可以使用命令，比如 `:help o` 又或 `:help :set` 来直接打开相关帮助。

## 特性

- 类似于 Vim 的键组合 (h、j、k、l、gg、G、0、$、ZZ,等)
- Ex 命令 (`:quit`、`:open www.foo.com`)
- 所有命令都支持按 `tab` 补全，实际上你输入时就会给出提示与建议
- hint 模式（按 `f` 键启用 hint 来操作链接）
- 扩展。你可以借助脚本扩展 Vimperator 的功能，正如你可以通过扩展来扩展 Firefox 一样
- 使用 `:echo window` 命令查看 JavaScript 对象，支持上下文相关的 tab 补全
- 可轻松定制的图形用户界面（使用 `:set gui=none` 命令隐藏菜单及工具栏）
- 能够 `:source` JavaScript 文件，如果你安装了 vimperator.vim，则可以语法高亮 ~/.vimperatorrc 文件
- 简便快捷的搜索（`:open foo` 在 Google 下搜索 foo，`:open ebay terminator` 在 ebay 搜索 terminator），支持智能关键字书签与搜索引擎
- 许多命令支持数字（比如`3<C-o>`）
- 错误时蜂鸣
- 支持“标记”（m**a** 在网页添加 a 标记，&#8216;**a** 跳到该标记处）
- 支持快速标记（可以使用 go**a-zA-Z0-9** 快速打开标记网页）
- 支持 `:map` 和 `:command`（脚本作者们可以使用 feedkeys()）
- `:time` 了解代码执行概况
- 使用 Vim 键击、可视模式移动光标、选择文本
- 支持外部编辑器
- 宏，可重放键击
- 自动命令，某些事件发生时执行
- 完整的帮助系统，解释所有命令、映射与配置项。
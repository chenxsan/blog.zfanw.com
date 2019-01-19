---
title: fzf.vim 用法
date: 2018-02-25
permalink: /fzf-vim-usage
---
[fzf](https://github.com/junegunn/fzf) 是一个终端命令行下的模糊查找工具，但它同样可以搭配 Vim 使用 - 这里介绍的也正是 fzf 在 vim 下的用法。

## 安装

首先我们需要安装 fzf 及 [fzf.vim](https://github.com/junegunn/fzf.vim)，这里使用 [vim-plug](https://github.com/junegunn/vim-plug) 安装插件 - 一步到位，不需要分别安装 fzf 与 fzf.vim。

在 `.vimrc` 配置文件中增加如下内容：

```rc
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' } 
Plug 'junegunn/fzf.vim' 
```
保存后重新打开 Vim，并且在命令行模式下执行：

```bash
:PlugInstall
```
稍等一会，我们就安装好了 fzf 与 fzf.vim。

## 使用

fzf 在 vim 下的用法很简单，只要在命令行模式下输入：

```bash
:Files
```
回车后 fzf 会打开一个窗口，并且默认索引当前工作目录下的所有文件，此时我们输入想要查找的字符，fzf 就会自动过滤出所有模糊匹配到的内容。你也可以在 `:Files` 命令后追加路径，比如 `:Files ~` 搜索用户主目录下的文件。

但有时我们不想使用模糊匹配，想要更精确地定位，那么可以在输入查找字符前加上一个英文的单引号 `'`，比如 `'vim-fzf`。

那么要怎么知道当前目录是哪个呢？你可以在命令行模式下输入 `:pwd` 查看。如果想切换当前工作目录，则可以执行 `:cd`。

要是半途想退出 fzf 打开的窗口，按 `ESC` 键即可。

## 键映射

当然，每次都要打入 `:Files` 再回车并不是很方便，拿 VSCode 来说，我们在 mac 下按 `Command + p` 键组合就可以调出文件定位工具，Vim 下我们也可以尝试类似键映射。

在 `.vimrc` 文件中加入如下：

```rc
nnoremap <silent> <C-p> :Files<CR>
```
保存后重启 vim，接下来我们就可以按 `Ctrl + p` 键组合来打开 fzf 窗口了。

## 帮助

碰上问题，想要查看帮助文件，可以直接在 Vim 命令行模式下输入：

```
:help fzf
```
回车后就能看到帮助文档。
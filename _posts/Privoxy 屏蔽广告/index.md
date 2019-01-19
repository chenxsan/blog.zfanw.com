---
title: Privoxy 屏蔽广告
date: 2013-02-02T03:53:08+00:00
permalink: /block-webpage-ad-with-privoxy
tags:
  - Privoxy
---

屏蔽网页广告，我们有很选择，比如安装浏览器扩展 Adblock；熟悉 JavaScript 的用户，还可以通过 [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) 这类扩展，自己动手编写 JavaScript 脚本来移除广告。

但如果你有使用多个浏览器的习惯，上述选择就非常麻烦，因为每个浏览器都要安装、配置。

[Privoxy](https://www.privoxy.org/) 可以一劳永逸解决这个问题。

在我们的电脑上，Privoxy 扮演的是中间**代理服务器**的角色。浏览器通过它向远程服务器发出请求，远程服务器返回文件后经过 Privoxy 过滤，再发回浏览器。

如果你还没有安装、配置 Privoxy，可以查阅我写的 [Privoxy 教程](https://blog.zfanw.com/privoxy-tutorial/)。

**说明，以下内容仅针对 http，不包括 https。**

## Privoxy 助手

如果你不确定以下规则是否生效时，可以通过 `http://config.privoxy.org/show-url-info` 网址来检查。

## 屏蔽图片、Banner 广告

屏蔽固定地址的图片是最简单的。

拿 http://httparchive.org/ 来说，它的主页上有一个 logo，地址是 `httparchive.org/images/http-archive-logo-color-h100.png`。

打开 `user.action` 文件，在文件末加入以下内容：

```
{+block}
httparchive.org/images/http-archive-logo-color-h100.png
```

`+block` 是 Privoxy 指令，后面跟着我们要屏蔽的图片网址 - 这个网址的格式为 `<host><port>/<path>`，三个部分均为可选，另外需要注意，host 部分不需要写 `http://`，因为 Privoxy 已经默认 http 协议。如果你不熟悉，可以查看 [Privoxy 文档](https://www.privoxy.org/user-manual/actions-file.html#AF-PATTERNS)。

保存 `user.action` 配置文件后，刷新页面就可以看到，图片已经被一个 4x4 尺寸的 gif 替换。

但你觉得这 gif 太丑，想换成赫本的照片。也很容易，找一张赫本的图片链接，然后设置 `+set-image-blocker` 就行：

```
{+block +set-image-blocker{https://upload.wikimedia.org/wikipedia/commons/9/98/Audrey_Hepburn_screentest_in_Roman_Holiday_trailer.jpg}}
httparchive.org/images/http-archive-logo-color-h100.png
```

刷新页面，httparchive 的 logo 已经变赫本。

但我们还可能碰上一些非常规的图片地址，比如 `.png?imageView&thumbnail=200y125&quality=85` 这样的，Privoxy 不敢确认它们是图片，需要我们额外添加 [+handle-as-image](http://www.privoxy.org/3.0.21/user-manual/actions-file.html#HANDLE-AS-IMAGE)：

```
{+block +handle-as-image +set-image-blocker{https://upload.wikimedia.org/wikipedia/commons/9/98/Audrey_Hepburn_screentest_in_Roman_Holiday_trailer.jpg}}
example.com/test.png?imageView&thumbnail=200y125
```
这样 Privoxy 就会将该网址识别为图片，而不是 HTML。

## 屏蔽文字广告

在屏蔽图片广告时，Privoxy 用到的 `+block` 属于 action。屏蔽文字广告则有所不同，需要同时用到 action 与 [filter](https://www.privoxy.org/user-manual/filter-file.html)。

仍拿 httparchive 为例，我们看到页面上有 `HTTP Archive` 的字眼，把它们换成 `Hello World` 如何？

打开 `user.filter`，添加如下内容：

```
FILTER: replace Replace all "HTTP Archive" with "Hello World"
s/HTTP Archive/Hello World/g
```

`FILTER` 是 Privoxy 的关键词。`replace` 是这个 filter 的名称，`Replace all "HTTP Archive" with "Hello World"` 则是说明。`s/HTTP Archive/Hello World/g` 是替换命令，熟悉 Vim 或 Sed 的用户应该对这个命令非常清楚。

定义 `replace` 的过滤器后，我们需要在 `user.action` 中调用它：

```
{+filter{replace}}
httparchive.org
```

刷新页面后，页面内的所有 HTTP Archive 都被换成 Hello World。

在写规则时，需要小心，因为 Privoxy 对配置文件非常敏感，一旦写错，就会退出，所以，如果发现 Privoxy 不正常、或是无法使用，请检查配置文件后重启 Privoxy。
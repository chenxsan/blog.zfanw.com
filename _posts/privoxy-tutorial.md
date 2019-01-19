---
title: Privoxy 教程
date: 2014-09-24T14:29:34+00:00
excerpt: 教你如何安装、配置、使用 Privoxy。
permalink: /privoxy-tutorial
tags:
  - Privoxy
---

**本文涉及的 Privoxy 版本为 3.0.26，该版本发布时间为 2016-08-27。**

Privoxy 是一个 web 代理软件：

> Privoxy is a non-caching web proxy with advanced filtering capabilities for enhancing privacy, modifying web page data and HTTP headers, controlling access, and removing ads and other obnoxious Internet junk.

简单说，就是进出你电脑的流量守门人。借由 Privoxy，我们可以控制出去的请求，还可以改写返回的响应。不必要的请求 – 比如视频广告的地址、图片广告的地址，我们可以直接 `block` 掉；不必要的响应内容 – 比如页面中的文字广告，我们可以借由 `filter` 过滤掉，不让它们在浏览器页面上显示。

## 安装 Privoxy

[Privoxy 支持的平台](https://www.privoxy.org/faq/installation.html#WHICHOS)非常多：

> At present, Privoxy is known to run on Windows 95 and later versions (98, ME, 2000, XP, Vista, Windows 7 etc.), GNU/Linux (RedHat, SuSE, Debian, Fedora, Gentoo, Slackware and others), Mac OS X (10.4 and upwards on PPC and Intel processors), OS/2, Haiku, DragonFly, ElectroBSD, FreeBSD, NetBSD, OpenBSD, Solaris, and various other flavors of Unix. 

针对各个平台，Privoxy 均提供有[安装说明](https://www.privoxy.org/user-manual/installation.html#INSTALLATION-PACK-WIN)。

下面简单提一下几个平台。

1. Windows 平台
    
    Windows 平台下的安装通常都可视化，下载安装包，双击，然后根据提示，一路点击即可安装。

2. Linux 平台

    多数时候可以通过仓库安装。

    比如 Ubuntu：

    ```bash
    sudo apt-get install privoxy
    ```

    又比如 openSUSE：

    ```bash
    sudo zypper install privoxy
    ```
3. mac 平台

    mac 上如果有安装 homebrew，则可以执行 `brew install privoxy` 来安装 Privoxy。

实在喜欢折腾的，就下载[源代码](http://sourceforge.net/projects/ijbswa/files/Sources/)自己编译安装。

## 启动 Privoxy

安装完 Privoxy 后，需要启动它，因为各平台下的各个系统情况不一，这里就不一一介绍，请看[启动 Privoxy 说明](http://www.privoxy.org/user-manual/startup.html)。

怎么知道 Privoxy 是否启动成功？请看下一步。

## 配置浏览器

Privoxy 在启动后，默认运行在 `localhost:8118` 上。所以我们只要将浏览器的代理指向它即可。

配置完浏览器后，在浏览器中打开 [http://p.p](http://p.p) 网址，看是否显示如下内容：

> This is Privoxy 3.0.26 on localhost (127.0.0.1), port 8118, enabled

如果有，说明 Privoxy 启动成功，且浏览器配置正确 - 此时，浏览器所有的流量都会经过 Privoxy 代理。

## 设置 Privoxy

在启动 Privoxy、配置浏览器完成后，可以开始定制我们的 Privoxy 了。

从核心配置文件 `config` 说起。

`config` 文件在各种系统下位置、名称可能并不一样，比如 Windows 系统下，它其实叫 `config.txt`，在 openSUSE 系统下，它所在的目录为 `/etc/privoxy`，这个目录是个软链接，指向 `/var/lib/privoxy/etc`。

不过，通常情况下，我们不需要修改 `config` 文件。

通常，我们会修改另外两类文件：

1. action 类文件
    1. match-all.action
    2. default.action
    3. user.action
2. filter 类文件
    1. default.filter
    2. user.filter

`match-all.action`、`default.action`、`default.filter` 这几个文件，建议不要修改，因为 Privoxy 升级时会覆盖掉。我们要把自定义的配置内容写入 `user.action` 或 `user.filter`。

### action 文件

顾名思义，action 文件定义 Privoxy 的动作，比如，我们在 `user.action` 文件中添加 `{+block}`：

```conf
{+block{禁止访问陈三的博客}}
.zfanw.com
```

分析一下：

1.  `{+block}` 是一个动作，`block`后的 `{}` 写的是注释，可写可不写。
2. `.zfanw.com` 是上述动作的一个作用对象，分两个部分，一个 host，一个 path，host 部分支持部分通配符，比如 `*`、`?`、`[0-9]`、`[a-z]`；path 部分是指第一个 `/` 后的部分网址，支持 POSIX 1003.2 正则表达式，比 host 部分灵活。具体见[actions 文档](http://www.privoxy.org/user-manual/actions-file.html#AF-PATTERNS)。

这样，Privoxy 就把我的网站拦下了：凡是 `zfanw.com` 的请求，均会返回 403，内容大概如下：

> The proxy server is refusing connections

那么，说了这么多，`user.action` 文件在哪修改？修改后是否需要重启 Privoxy？

在配置过 Privoxy 的浏览器访问 `http://config.privoxy.org/show-status`，就可以看到所有配置文件的路径。默认情况下，我们只能查看配置，但其实可以[启用编辑功能](https://www.privoxy.org/3.0.26/user-manual/config.html#ENABLE-EDIT-ACTIONS)。通常我是直接用 Vim 来编辑。编辑完保存就能看到效果，无需重启 Privoxy。

### filter 文件

filter 文件定义过滤**响应**的规则，比如：

```
FILTER: replaceText 替换文本
s|陈三|陈四|g
```

第一行中，大写的 `FILTER` 表示定义一条过滤规则，`replaceText` 表示规则名称，再后面是注释。

第二行，对返回的页面进行修改。比如你用过 Vi/Vim 或 sed 等工具，应该对 `s` 这个替换命令很熟悉。简单说，上面的语句就是把页面内的代码作过更换 - Privoxy 去广告的原理正在于这里。

但是，`user.filter` 中只是定义过滤的规则，规则的应用，还是要在 action 文件中，所以在 `user.action` 文件中，加入如下配置：

```conf
{+filter{replaceText}}
.zfanw.com
```

我猜想你已经知道上面的配置的意思：`filter` 是指令，要求执行 `user.filter` 中定义的 `replaceText`，`.zfanw.com` 则定义 `filter` 的作用对象 - 即网址。

可是在试验中你可能发现，上面的 `FILTER` 规则并没有生效。

不不不，这当然不是作者在恶搞。这是因为，我的网站已经启用 https，而 Privoxy 对 [https 加密的页面能做的极少](https://www.privoxy.org/faq/misc.html#SSL) - 唯一的例外，就是前面生效的 `{+block}`。那是因为 https 请求的域名部分仍暴露给 Privoxy，所以才有办法拦截。

这意味着，在未来 https 越来越盛行的趋势下，Privoxy 的需求会越来越小。拿百度来说，现在它已经全线启用 https，曾经能够屏蔽百度页面内广告的 Privoxy，现在已无能为力。

## 代理转发

目前的主流浏览器都只支持 http 代理，是的，连 https 代理都不支持，更别提什么 socks 代理。

现在假定你本地启动了一个 socks 代理，运行在 `127.0.0.1:9999`，想让浏览器使用。怎么办？

一个办法，是借助 [Privoxy 转发](https://www.privoxy.org/user-manual/config.html#SOCKS)。

打开 Privoxy 的 `config` 文件，加入如下内容：

```conf
forward-socks5 / 127.0.0.1:9999 .
```
这样，所有经由 Privoxy 代理的流量均会被转发到本地 socks5 代理。

当然，你也可以根据域名来分流，比如 Google 的网站要转发给 sock5 代理，国内的网站不需要，则只要转发 Google 的域名即可：

```conf
forward-socks5 .google.com 127.0.0.1:9999 .
forward-socks5 google.com 127.0.0.1:9999 .
```
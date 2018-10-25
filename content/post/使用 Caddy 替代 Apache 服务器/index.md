---
title: 使用 Caddy 替代 Apache 服务器
date: 2018-10-25
permalink: /replace-apache-with-caddy
---

我曾经写过一篇 [macOS 下的 Apache 配置](https://blog.zfanw.com/macos-apache/)，是了，Apache 配置很复杂，不复杂的话，我就记在脑子，不用写下来。

或许对专业人士来说，Apache 的复杂是可以接受的。但对我这样，偶尔一两次才需要在本地启动 PHP 服务、运行后端代码的前端开发人员来说，这种复杂不值得。所以慢慢地，我在向 [caddy](https://caddyserver.com) 迁移。

## 安装

Caddy 是基于 Go 语言写的，因此，它就只是一个可执行程序文件。我们在[下载页面](https://caddyserver.com/download)勾选平台、插件及许可证后，下载页面上就会显示相应的安装操作：

1. 直接下载可执行文件：https://caddyserver.com/download/darwin/amd64?license=personal&telemetry=off
2. 一键安装：`curl https://getcaddy.com | bash -s personal`

我通常使用第二种方案，这样不必再自行配置环境变量路径。

## 启动 caddy

在启动 caddy 前，我们需要关闭 macOS 上的 apache：

1. `sudo apachectl stop` - 停止 apache
2. `sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist` - 永久禁用 apache

好了，假定我们的项目在 `/Users/sam/blog` 目录，我们可以进入该目录，并执行 `caddy`：

```sh
$ caddy
Activating privacy features... done.
http://:2015
WARNING: File descriptor limit 4864 is too low for production servers. At least 8192 is recommended. Fix with "ulimit -n 8192".
```
caddy 会以当前目录为根目录，默认使用端口 2015。此时我们访问 http://:2015 即可访问 `/Users/sam/blog` 下的 html 文件。

当然，我们要更换端口也非常容易：

```sh
$ caddy -port 80
```
我们还可以更换域名，比如，我想换成 blog.sam：

```sh
$ caddy -host blog.sam -port 80
```
## Caddyfile

但我们的 `/Users/sam/blog` 目录下的 index 是一个 php 文件：

```php
<?php echo phpinfo(); ?>
```
此时我们直接访问 http://blog.sam/index.php 的话，看到的只有 php 代码本身。

我们需要 php 引擎来解释 php 代码。

首先是[安装 php](https://secure.php.net/manual/en/install.macosx.php)，如果你使用 homebrew，那么在 macOS 上安装 php 是比较容易的：

```sh
$ brew install php@7.2
```
之后可以通过 `php -v` 来确认安装情况。

准备好 php 后，caddy 要如何调用它来解释 php 代码呢？

我们需要一个配置文件 Caddyfile，并在其中配置 [fastcgi](https://caddyserver.com/docs/fastcgi)：

```Caddyfile
http://blog.sam {
  root /Users/sam/blog
  fastcgi / 127.0.0.1:9000
}
```
对，就这么简单，简单到我觉得这一篇都是多余的。

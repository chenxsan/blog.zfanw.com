---
title: macOS Apache 配置
date: 2018-02-11
permalink: /macos-apache
---

本文涉及的操作系统、软件版本：

1. macOS Sierra 10.13.3
2. Apache/2.4.28

一个事实：macOS 系统自带 Apache 软件。

我们可以在命令行下查看 Apache 版本号：

```bash
$ httpd -v                                                      
Server version: Apache/2.4.28 (Unix)
Server built:   Oct  9 2017 19:54:20
```

## 启动 Apache
那，要怎么知道 mac 上的 Apache 是否已经启动？简单，我们在浏览器打开网址 `http://localhost`。

1. 如果出现 `Unable to connect` 那就是还没启动；
2. 如果出现 `It works!`，那就是已经启动；
3. 如果出现其它，那就已经启动，并且配置过。

如果你的 mac 上 Apache 还未启动，可以通过以下命令来启动 Apache：

```bash
$ sudo apachectl start
```
是的，你需要 `sudo`。普通用户没有权限操作 [`apachectl`](https://httpd.apache.org/docs/2.4/programs/apachectl.html)。

mac 下 Apache 默认的目录在 `/Library/WebServer` 下，我们来看看该目录下的各文件/文件夹的权限、所有者：

```bash
ls -la /Library/WebServer 
total 0
drwxr-xr-x   5 root  wheel   170 Feb  7  2017 .
drwxr-xr-x+ 63 root  wheel  2142 Sep  8 11:13 ..
drwxr-xr-x   4 root  wheel   136 Feb  7  2017 CGI-Executables
drwxr-xr-x  14 root  wheel   476 Sep  8 11:14 Documents
drwxr-xr-x   3 root  wheel   102 Feb  7  2017 share
```
所有目录的所有者都是 `root`，假如你当前登录的用户不是 `root`，那么，你操作该目录下的任何文件都需要 `sudo` 。你觉得每次都要输入密码太荒唐。

还是放主目录吧。

让我们在自己的主目录下新建一个 `Sites` 目录：

```bash
$cd ~
$ mkdir Sites
```
如果我们在 Finder 下查看，就会发现这个 `Sites` 的目录的图标与众不同：

![sites folder in macOS](sites-folder.png)

这是因为它本来是 mac 上自带的 web sharing 设置的主目录，只不过 [OSX Mountain Lion](https://support.apple.com/en-us/HT5230) 之后被去掉了。

创建完 `Sites`，我们继续在 `Sites` 下创建一个新目录，

```bash
$ cd Sites
$ mkdir blog
```
并创建一个空的 html 文件：

```bash
$ cd blog
$ touch index.html
```
我们在新建的 `index.html` 文件中添加一段 `hello world`：

```bash
$ echo 'hello world' >> index.html
```
那么，要怎样让 Apache 从我们的 `Sites` 目录读取文件呢？

## 修改 Apache 配置

可是配置在哪，又该怎么改。

对一头扎进非专业领域的前端开发人员来说，这并不容易。

查找 Apache 文档，我们看到一个 [Per-user web directories](https://httpd.apache.org/docs/2.4/howto/public_html.html) 的功能：

> On systems with multiple users, each user can be permitted to have a web site in their home directory using the UserDir directive. Visitors to a URL http://example.com/~username/ will get content out of the home directory of the user "username", out of the subdirectory specified by the UserDir directive.

在多用户系统里，通过 `UserDir` 指令，可以让每个用户都在自己的主目录下拥有一个网站。不过，这个特性默认是关闭的。

我们需要调整 `/etc/apache2/httpd.conf` 文件。

执行 `sudo vim /etc/apache2/httpd.conf` 打开 `httpd.conf` 文件，然后查找 `userdir`。

我们找到如下俩行被注释掉的内容：

```
#Include /private/etc/apache2/extra/httpd-userdir.conf
```
```
#LoadModule userdir_module libexec/apache2/mod_userdir.so
```
把行首的 `#` 去掉，并保存。

接着再编辑 `/private/etc/apache2/extra/httpd-userdir.conf` 文件，增加内容：

```conf
UserDir Sites
```
然后重启 apache：

```bash
$ sudo apachectl restart
```

此时访问 `http://localhost/~sam/`，我们期望页面会列出 `Sites` 目录下的所有内容。

但事与愿违：

> 403 Forbidden
> Forbidden
> You don't have permission to access /~sam/ on this server.

我们来看看日志：

```bash
$ tail -f /var/log/apache2/error_log
[Sat Sep 09 23:37:12.040886 2017] [authz_core:error] [pid 86332] [client ::1:57810] AH01630: client denied by server configuration: /Users/sam/Sites/
```
根据日志，我们找到 https://wiki.apache.org/httpd/ClientDeniedByServerConfiguration。

里面提到 [`Directory`](http://httpd.apache.org/docs/current/mod/core.html#directory)，是的，默认情况下，`Sites` 是不对外开放的，我们需要配置权限。

仍要在 `/etc/apache2/httpd.conf` 文件中配置：

```conf
<Directory /Users/sam/Sites>
  Require all granted
</Directory>
```
再度访问 `http://localhost/~sam/`，仍有问题，再看看错误日志：

> [Sat Sep 09 23:51:57.419328 2017] [autoindex:error] [pid 87722] [client ::1:58376] AH01276: Cannot serve directory /Users/sam/Sites/: No matching DirectoryIndex (index.html,index.html,index.php) found, and server-generated directory index forbidden by Options directive

说是缺少 `index` 文件，而服务器配置禁止直接列出目录下的内容 - 这便是 apache 403 的缘故。

不过我们不打算在 `Sites` 目录下直接存放文件，所以这个错误可以忽视。

还记得我们前面创建的 `blog` 下的 `index.html` 文件么？试试访问它 `http://localhost/~sam/blog/`，看到 `hello world`。也就是说，我们其实已经成功配置 apache。

过了有一阵子，我们的 blog 完全运转，可是，每次都要输入 `http://localhost/~sam/blog` 这样的访问路径，实在太麻烦。

能不能使用 `http://blog.sam` 来访问 blog？

## 配置虚拟主机

为什么需要虚拟主机？

我们知道，一台机器通常是只有一个 ip 的。而现状是，会有多个网址，比如 blog.sam，blog.chen 要解析到同一个 ip 上，Apache 需要一种机制来区别它们 - 这就是虚拟主机（vhost）。

打开 `/etc/apache2/httpd.conf`，添加如下内容：

```
<VirtualHost *:80>
  ServerName blog.sam
  DocumentRoot "/Users/sam/Sites/blog/"
</VirtualHost>
```
保存然后重启 Apache，访问 `http://blog.sam`，得到：

```
ERR_NAME_NOT_RESOLVED
```

因为 DNS 无法解析出它的 ip 地址。

## 修改 hosts 文件

要把 blog.sam 解析成本地 ip，我们有许多办法，比如利用本地 dns 服务器，但最简单的是，直接改 `/etc/hosts` 文件，我们在最末添加一行：

```
127.0.0.1 blog.sam
```

然后在命令行下 `ping` 一下看看：

```bash
$ ping blog.sam         
PING blog.sam (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.121 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.095 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.097 ms
```
很好，有响应。

再访问 `http://blog.sam` 试试，看到 `hello world`，成功。
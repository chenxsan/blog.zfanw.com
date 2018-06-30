---
title: Mosh - mobile shell
date: 2012-11-02T13:50:15+00:00
permalink: /mosh
tags:
  - mosh
  - ssh

---

如果你要操作远程服务器 - 那么就不可避免要用到 [ssh](https://zh.wikipedia.org/wiki/Secure_Shell)。

不过很遗憾，ssh 在中国境内的可用性非常糟糕。不只是输入有很大延迟的问题，还可能你操作到一半，连接就断掉，且不说不会自动重连，甚至 Control-C 都不给响应。

[Mosh](https://mosh.org/) 能够很大程度改善这些恶劣体验。我甚至认为，所有服务器端的操作系统都应该默认安装 Mosh。

## 安装 Mosh

[Mosh 支持的系统](https://mosh.org/#binaries)非常多，macOS、Windows、Linux 的各种发行版（Debian、Ubuntu、openSUSE 等）、Android、iOS、FreeBSD、OpenBSD 等等。我们最好通过相应的包管理器来安装，因为最简单。实在没有选择的时候，还可以[自己编译 Mosh](https://mosh.org/#build-instructions)。

需要注意的是，Mosh 要同时安装在客户端及服务器端上。

## 打开 UDP 端口

因为 Mosh 使用的是 UDP 协议，所以如果你的服务器有启动防火墙，则需要打开 UDP 端口给客户端连接 - 具体方法请自行查询。

## 连接远程

接下来就是从客户端连接：

```bash
$ mosh -p 60001 sam@zfanw.com
```
    
`p` 参数用于指定要连接的 UDP 端口。

如果你的 SSH 连接配置了公钥/私钥，则 mosh 命令可以通过 `mosh sever` 的形式连接，基本上，可以把它当作 ssh 命令的替换 - 只是更稳健。
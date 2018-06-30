---
title: Privoxy 代理共享
date: 2015-07-31T16:41:20+00:00
excerpt: 配置 Privoxy，共享代理给多个设备
permalink: /privoxy-proxy-share
tags:
  - Privoxy
---

Privoxy 启动后，会在你的设备上创建一个代理服务器，默认监听端口 8118。它的这个行为定义在 `config` 配置文件中：

```
listen-address 127.0.0.1:8118
```
但是，这样就只有安装 Privoxy 的设备可以使用 Privoxy。

## 添加监听地址

如果我们要共享 Privoxy 代理，允许同一 wifi 环境下其它设备使用 Privoxy，则需要在配置文件中添加一个监听地址，比如：

```
listen-address 192.168.1.110:8118
```

`192.168.1.110` 是安装了 Privoxy 的设备 ip 地址。

然后在其它设备，比如我的 openSUSE 下的 firefox 里，将代理指向 `192.168.1.110:8118` 即可。

不过这个方法会有一个问题，比如换个网络，路由分配的 ip 地址变了，会导致 Privoxy 启动失败。也就是说，每次电脑的 ip 变化，都需要修改 `config` 中的 `listen-address`，比较麻烦。
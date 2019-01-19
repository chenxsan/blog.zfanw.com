---
title: Privoxy 无法启动
date: 2015-01-27T12:01:00+00:00
permalink: /privoxy-failed-problem
tags:
  - Privoxy
---

我的经历，Privoxy 无法启动时，十有八九是因为 `config` 文件配置错了。

比如这一次在 openSUSE 下碰到的问题：

```bash
sam@orchid:~|master⚡⇒  systemctl status privoxy.service
privoxy.service - Privoxy Web Proxy With Advanced Filtering Capabilities
    Loaded: loaded (/usr/lib/systemd/system/privoxy.service; enabled)
    Active: failed (Result: exit-code) since Tue 2015-01-27 16:00:31 HKT; 16s ago
  Process: 9156 ExecStart=/usr/sbin/privoxy --chroot --pidfile /run/privoxy.pid --user privoxy /etc/config (code=exited, status=1/FAILURE)
  Process: 9154 ExecStartPre=/usr/bin/cp -upf /lib/libresolv.so.2 /lib/libnss_dns.so.2 /var/lib/privoxy/lib/ (code=exited, status=0/SUCCESS)
  Process: 9151 ExecStartPre=/usr/bin/cp -upf /etc/resolv.conf /etc/host.conf /etc/hosts /etc/localtime /var/lib/privoxy/etc/ (code=exited, status=0/SUCCESS)
  Main PID: 4310 (code=exited, status=15)
```

Privoxy 启动失败。

调查发现是因为在住处的网络环境下我给 `config` 文件添了一行配置：

```conf
listen-address 192.168.1.100:8118
```

而办公室里分配给我电脑的 IP 地址并不是 `192.168.1.100`，于是出错。

去掉这一行，重启 Privoxy 就解决问题了。
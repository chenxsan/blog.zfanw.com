---
title: SFTP 用法
date: 2015-04-05T14:37:58+00:00
excerpt: sftp 连接、上传、下载文件
permalink: /sftp
tags:
  - sftp
---

如果你用过 ftp，那么你已经知道 sftp 是什么。**s** 指 secure，sftp 即安全的 ftp，类似 https 中的 s。

## 连接

ssh 连接通常是这样：

```bash
$ ssh sam@zfanw.com
```
回车后，会弹出提示，要求输入密码。

sftp 用法也一样：

```bash
$ sftp sam@zfanw.com
```
如果你使用私钥/公钥的形式连接服务器，那更简单了：

```bash
$ sftp myServer
```
连接成功后，终端显示：

> sftp >

## 下载文件或文件夹

ftp 主要用于文件传输，sftp 提供的下载文件的指令是 `get`：

```bash
$ get -r blog
```
`-r` 表示递归，这样就把整个 `blog` 目录下载到本地。

本地的哪里？

我们可以借助 `lpwd` 命令来查看 - `pwd` 前加了 `l` 表示 `local`。可以猜到，`lcd` 可以切换本地的当前目录。

## 上传文件或文件夹

下载文件用 `get`，上传自然是用 `put`。

首先要连接到远程，然后就可以使用 `put` 命令来上传本地文件或文件夹：

```bash
$ put -r blog
```
就可以把整个 `blog` 文件夹上传到远程服务器。

## 帮助

如果想查看 sftp 的帮助，在命令行下输入 `help` 即可：

```bash
$ sftp > help
Available commands:
bye                                Quit sftp
cd path                            Change remote directory to 'path'
chgrp grp path                     Change group of file 'path' to 'grp'
chmod mode path                    Change permissions of file 'path' to 'mode'
chown own path                     Change owner of file 'path' to 'own'
df [-hi] [path]                    Display statistics for current directory or
                                   filesystem containing 'path'
exit                               Quit sftp
get [-Ppr] remote [local]          Download file
help                               Display this help text
lcd path                           Change local directory to 'path'
lls [ls-options [path]]            Display local directory listing
lmkdir path                        Create local directory
ln [-s] oldpath newpath            Link remote file (-s for symlink)
lpwd                               Print local working directory
ls [-1afhlnrSt] [path]             Display remote directory listing
lumask umask                       Set local umask to 'umask'
mkdir path                         Create remote directory
progress                           Toggle display of progress meter
put [-Ppr] local [remote]          Upload file
pwd                                Display remote working directory
quit                               Quit sftp
rename oldpath newpath             Rename remote file
rm path                            Delete remote file
rmdir path                         Remove remote directory
symlink oldpath newpath            Symlink remote file
version                            Show SFTP version
!command                           Execute 'command' in local shell
!                                  Escape to local shell
?                                  Synonym for help
```
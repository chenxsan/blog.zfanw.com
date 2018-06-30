---
title: Ubuntu 软件安装
date: 2012-11-13T09:50:02+00:00
permalink: /install-software-on-ubuntu
tags:
  - Ubuntu
---

> 本文基于 Ubuntu 16.04

就我所知，Windows 系统下软件大致分俩种：

1. 安装包 - 需要你安装，通常是双击后一路点击 yes，
2. 压缩包 - 解压后就可以直接使用

但其实它们是一样的，即它们都已经编译过。我们在 Windows 下基本不可能碰上要求我们自己编译的软件。

Ubuntu 下的软件同样分俩种：

1. 源代码 - 是的，需要我们自己动手编译，
2. 软件包 - 有谁替我们编译好了。

那么，为什么 Linux 下软件包不全部以二进制可直接执行的形式提供出来，方便用户呢？我觉得原因有几个：

1. 从源代码编译让人更有安全感 - 天知道 Windows 那些已经打包好的软件里究竟藏了什么，
2. Linux 平台发行版太多 - 对开发者来说，一一编译不大现实，
3. 某些开源组件涉及版权。

因此，在 Ubuntu 下，软件安装方案大致以下俩类：

1. 通过软件仓库安装
2. 下载编译过的软件包手动安装
2. 自己编译并安装

## Ubuntu 软件仓库

Ubuntu [软件仓库](https://help.ubuntu.com/community/Repositories/Ubuntu)提供许多已编译的软件包，它有四个频道：

1. `Main`
2. `Restricted`
3. `Universe`
4. `Multiverse`

默认情况下，Ubuntu 仅从 `Main` 与 `Restricted`下载、安装软件，但我们可以自行启用其他两个频道。

从这些软件仓库下载软件安装的方法有很多种。

### APT 命令行

APT 是 Advanced Packaging Tool 的缩写，用于管理软件包。

通过它的命令行工具来安装软件非常简单：

```
$ sudo apt-get install <package_name>
```
<package_name> 是软件在源里的名称，如果无法确定，可以通过下列命令来查询：

```bash
$ sudo apt-get update -y
$ apt-cache search <keyword>
```

譬如说要在 Ubuntu 下安装 dropbox，可以通过上述命令确定 dropbox 的名称，如下：

```bash
$ apt-cache search dropbox
libnet-dropbox-api-perl - Perl module providing a dropbox API interface
php-dropbox - Dropbox API library
thunar-dropbox-plugin - context-menu items from dropbox for Thunar
caja-dropbox - Dropbox integration for Caja
nautilus-dropbox - Dropbox integration for Nautilus
```

### Aptitude

如果不喜欢命令行，你可以试试 Aptitude，它是 APT 命令工具的用户界面，通过它可以操控 APT 命令。它支持键盘操作 – 如果熟悉 Vim，就会发现大部分快捷键均可用，它也部分支持鼠标操作。

个人平时极少使用这个工具，更倾向于用命令行 `apt-get`。

### 软件中心

Ubuntu 软件中心对新手来说，是非常简单明了的软件管理工具。

打开软件中心，搜索软件，安装软件，就这么简单。

## 下载 Deb 安装包

某些软件不在 Ubuntu 仓库中，但在它们的网站上提供了编译过的安装包文件，文件格式是 `.deb`。

安装 `.deb` 包的方法如下：

1. 通过 GDebi 工具，可以直接在命令行中运行，也可以通过图形界面 GDebi-gtk，
2. dpkg 安装 – 运行命令 `sudo dpkg -i /path/to/package_name.deb`。

## PPA – Personal Package Archives

因为安全、稳定性等因素，Ubuntu 软件源中没有收录所有软件，于是有了 PPA，它的作用类似于 Ubuntu 官方的源，只不过是由个人提供打包，当然也会有某些官方源中的软件通过 PPA 发布不稳定版本。

PPA 的使用也非常简单，首先添加 PPA 源到 Ubuntu：

```bash
$ sudo add-apt-repository ppa:user/ppa-name
```

然后更新所有源：

```bash
sudo apt-get update -y
```
接着便是安装 – 因为将 PPA 源添加到 Ubuntu 后，安装软件的方法与从官方源中安装并没有两样，所以，第一步中介绍的方法均可以使用：

```bash
sudo apt-get install <package_name>
```

## 编译源代码

源代码包中一般均带有 `INSTALL` 或 `README` 之类的安装说明文件，根据说明安装即可。

不过这种方法是我最不愿意碰的，因为编译前往往要求安装一堆 – 而我只是想装好软件、然后使用。

## 参考

2. [Ubuntu 软件安装方法](https://help.ubuntu.com/community/InstallingSoftware)
3. [APT 管理软件包](https://help.ubuntu.com/community/AptGet/Howto?action=show&redirect=AptGetHowto)
4. [Aptitude](https://en.wikipedia.org/wiki/Aptitude_(software))
5. [软件中心](https://help.ubuntu.com/community/UbuntuSoftwareCenter?action=show&redirect=SoftwareCenterFAQ)
6. [PPA](https://help.launchpad.net/Packaging/PPA)
7. [从 PPA 安装软件](https://help.launchpad.net/Packaging/PPA/InstallingSoftware)
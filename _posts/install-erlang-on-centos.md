---
date: 2016-10-13T19:15:05+08:00
title: CentOS 安装 Erlang
permalink: /install-erlang-on-centos
tags:
  - CentOS
  - Erlang
---

## 软件仓库

从 CentOS 软件仓库安装 Erlang 是最简单、最省事的。

不过 CentOS 默认仓库中没有 Erlang，需要我们预先安装 [Extra Packages for Enterprise Linux 项目](https://fedoraproject.org/wiki/EPEL)。

1. 安装 `epel-release`

    ```bash
    $ sudo yum install epel-release -y
    ```

2. 之后便可以安装 Erlang

    ```bash
    $ yum install erlang -y
    ```

安装完成后，在命令行下输入 `erl`：

```bash
$ erl
Erlang R16B03-1 (erts-5.10.4) [source] [64-bit] [smp:2:2] [async-threads:10] [hipe] [kernel-poll:false]

Eshell V5.10.4  (abort with ^G)
```
就可以查看当前安装的 Erlang 版本 - 显然，版本还比较老旧。

如果你嫌弃 CentOS 软件仓库中的 Erlang 版本过低，我们还可以尝试 Unix/Linux 均可使用的 [kerl](https://github.com/kerl/kerl)，又或自己下载源码编译。

## kerl

首先请确保你的操作系统上已经安装 `curl` 与 `git`。

下载 `kerl`：

```bash
$ curl -O https://raw.githubusercontent.com/kerl/kerl/master/kerl
```
然后将 `kerl` 改成可执行：

```bash
$ chmod a+x kerl
```
执行 `kerl list releases` 可以查看 Erlang 所有发行版本：

```bash
$ ./kerl list releases
./kerl list releases
R10B-0 R10B-10 R10B-1a R10B-2 R10B-3 R10B-4 R10B-5 R10B-6 R10B-7 R10B-8 R10B-9 R11B-0 R11B-1 R11B-2 R11B-3 R11B-4 R11B-5 R12B-0 R12B-1 R12B-2 R12B-3 R12B-4 R12B-5 R13A R13B01 R13B02-1 R13B02 R13B03 R13B04 R13B R14A R14B01 R14B02 R14B03 R14B04 R14B R14B_erts-5.8.1.1 R15B01 R15B02 R15B02_with_MSVCR100_installer_fix R15B03-1 R15B03 R15B R16A_RELEASE_CANDIDATE R16B01 R16B02 R16B03-1 R16B03 R16B 17.0-rc1 17.0-rc2 17.0 17.1 17.3 17.4 17.5 18.0 18.1 18.2 18.2.1 18.3 19.0 19.1 19.2 19.3 20.0 20.1 20.2
Run './kerl update releases' to update this list from erlang.org
```
有了，最新版本是 20.2，尝试安装：

```bash
$ ./kerl install 20.2
```
> No build named 20.2

很遗憾，报错。出人意料的是，使用 kerl 安装 Erlang 前，我们需要先编译 Erlang，命令结构是 `kerl build <release> <build_name>`：

```bash
$ ./kerl build 20.2 20.2
```
很快你就发现该命令报告大量错误。

这里又是一个意外：kerl 不负责安装[编译 Erlang 必需的依赖](https://github.com/erlang/otp/blob/maint/HOWTO/INSTALL.md#required-utilities)，需要我们自己安装：

```bash
$ sudo yum install -y which perl openssl-devel make automake autoconf ncurses-devel gcc
```
安装完编译所需依赖后，重新执行 `kerl build`：

```bash
$ ./kerl build 20.2 20.2
```
待构建成功后，将新构建出的 20.2 安装到指定目录：

```bash
$ ./kerl install 20.2 ~/erlang
Installing Erlang/OTP 20.2 (20.2) in /home/sam/erlang...
You can activate this installation running the following command:
. /home/sam/erlang/activate
Later on, you can leave the installation typing:
kerl_deactivate
```
请注意**提示**，我们还需要执行 `. /home/sam/erlang/activate` 激活 Erlang。

你可能会说，看起来 kerl 没比自己编译源代码简单。从定位上说，kerl 更像 Ruby 的 RVM、rbenv 或是 Node.js 的 nvm，能够管理多个 Erlang 版本 - 而自己编译源码的话，就没这么方便。

## 编译源代码

如果你决定要[自行编译 Erlang 源代码](https://github.com/erlang/otp/blob/maint/HOWTO/INSTALL.md#required-utilities)，那么请按以下步骤操作。

1. 安装构建依赖：

    ```bash
    $ sudo yum install -y which wget perl openssl-devel make automake autoconf ncurses-devel gcc
    ```

2. 从 [Erlang 官网](http://www.erlang.org/downloads)下载源代码
   
    ```bash
    $ curl -O http://erlang.org/download/otp_src_20.2.tar.gz
    ```

4. 解压 tar.gz 包

    ```bash
    $ tar zxvf otp_src_20.2.tar.gz
    ```
4. 安装

    ```bash
    $ cd otp_src_20.2
    $ ./otp_build autoconf
    $ ./configure && make && sudo make install
    ```
5. 验证

    ```bash
    $ erl
    ```
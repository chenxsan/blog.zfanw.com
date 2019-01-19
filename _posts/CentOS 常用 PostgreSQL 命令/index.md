---
date: 2016-08-09T12:56:31+08:00
title: CentOS 常用 PostgreSQL 命令
permalink: /centos-postgresql-command
tags:
  - PostgreSQL
---

## 用户登录

CentOS 7 安装完 PostgreSQL 后，默认会创建 `postgres` 用户。

要使用 PostgreSQL，我们需要先切换到 `postgres` 用户：

```bash
$ sudo -i -u postgres
```
接着运行：

```bash
$ psql
```

进入 PostgreSQL 命令行。此时命令行提示不再显示 `$`，而是 `postgres=#`。

现在就可以执行各种 SQL 语句。

## 退出 PostgreSQL 命令行

`\q` 或 `\quit`：

```bash
postgres=# \q
```

## 查看所有数据库

`\l` 或 `\list`：

```bash
postgres=# \l
```

## 连接数据库

`\c` 或 `\connect`：

```
postgres=# \c test
```

## 查看表

在连上数据库后，可以查看数据库下所有数据表：

```bash
postgres=# \d
```

`\d` 会罗列出所有的数据表，包括 PostgreSQL 自动创建的自增长字段的表。如果只想查看用户创建的表，

```bash
postgres=# \dt
```

如果想查看单个数据表的结构，则在命令后指定表名：

```bash
postgres=# \d test
```

附：[PostgreSQL 文档](https://www.postgresql.org/docs/current/static/app-psql.html)。
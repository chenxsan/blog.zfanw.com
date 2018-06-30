---
title: 如何在 Github 给开源项目贡献代码
date: 2014-09-16T22:44:55+00:00
permalink: /best-practice-contribute-on-github
tags:
  - Git
  - Github
---

“Fix typo” 算不算贡献？毫无疑问。

好了，就在刚刚，你发现 Github 上某开源项目的一个标点错误，但这是你第一次尝试给开源项目贡献代码。你需要一点帮助，以便更好应对可能出现的种种意外。

## 分叉

首先，`Fork` 开源项目到自己 github 账户下，比如 `webpack/webpack` 到 `chenxsan/webpack`。

## 克隆

然后从 `chenxsan/webpack` 克隆代码到本地：

```bash
$ git clone https://github.com/chenxsan/webpack
```

## 分支

进入克隆下来的代码目录，并创建一个分支：

```bash
$ cd webpack
$ git checkout -b dev
```
这里的分支名为 `dev`，通常可以根据目的起一个更具体的分支名称，比如 `fix-typo`。

## Fix typo

在 `dev` 分支下修正问题，并 commit：

```bash
$ git commit -m 'Fix typo'
```

## 推送

将本地 commit 推送到 github 上：

```bash
$ git push origin dev:fix-typo
```
我们将本地的 `dev` 分支推送到 github 上的 `fix-typo` 分支。

## 提交 Pull request

分支推送到 github 后，`chenxsan/webpack` 项目下就会出现 pull request 相关的按钮，提交给上游的 `webpack/webpack`，请求 Merge。

## 意外

但很不幸，因为一点其它问题，该 Pull request 被拒绝，项目管理员要求你调整后再提交 - 此时，上游 `webpack/webpack` 已经有新代码并入。

问题来了：本地的 `dev` 分支所基于的 commit 已经不是最新。

## 更新

我们需要从上游更新代码。

首先，配置上游库：

```bash
$ git remote add upstream https://github.com/webpack/webpack
```
然后切换至 `master` 分支更新上游代码：

```bash
$ git pull --rebase upstream master
```
接着再切换至 `dev` 分支，`rebase` 代码：

```bash
$ git rebase master
```
注意，如果你的 `dev` 分支有人使用的话，请谨慎使用 `rebase`，因为它会影响别人。

## 再度推送

修改完成后，我们可以再度推送代码到 github：

```bash
$ git push origin dev:fix-typo
```
但会推送失败 - 因为线上的 `fix-typo` 与线下的 `dev` 分支的 base 已经不一致。git 会提示我们先 pull、merge，但那样 commit 消息会很乱。

我们可以选择粗暴的方案：

```bash
$ git push --force origin dev:fix-typo
```
为什么可行？因为基本不可能出现有人基于我们线上 `fix-typo` 分支的情况。

## 清理分支

在 pull request 被合并后，删除远程的 `fix-typo` 分支及本地 `dev` 分支

```bash
$ git push origin --delete fix-typo
$ git branch -D dev
```
## 又及

这里有几个重点。

一个是保持 `master` 分支干净，不在 `master` 分支上 commit。这一条建议来自 [jQuery](http://contribute.jquery.org/commits-and-pull-requests/#never-commit-on-master)。目的是给自己方便：

> This is really only for your own convenience: it&#8217;s easy for the maintainer of a project to accept your pull request from your master branch, but it&#8217;s problematic for your fork when you want to pull the changes back and your master branch has diverged from upstream.
> 
> 这纯是为了你自己方便：对项目维护者来说，接受来自你 master 分支的 pull request 是很简单的事，但对你的分支来说，这会是个问题，比如你要从上游分支拉回修改，但是你的 master 分支却已经分道扬镳。

整个过程中，我们的 `master` 分支只是为同步上游库而存在。

另一个是[保持 commit 历史干净](http://ginsys.eu/git-and-github-keeping-a-feature-branch-updated-with-upstream/)。所以上面的流程中，拉回上游库的修改用了 `--rebase`，而不是先 fetch 再 merge。

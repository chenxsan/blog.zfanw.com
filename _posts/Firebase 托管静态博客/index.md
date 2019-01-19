---
title: Firebase 托管静态博客
date: 2018-07-30
dateModified: 2018-8-14
permalink: /firebase-hosting-static-site
tags:
  - firebase
  - 教程
---

我的博客就是些静态 HTML 文件，一向都部署在自建的 VPS 上，但最近觊觎 CDN 的速度，于是调查一番，选了 firebase 来托管博客。

firebase 提供的免费托管特性如下：

1. 可存储的免费空间为 1 GB
2. 每个月免费流量为 10 GB
3. 可免费自定义域名，并配有免费 SSL 证书（Let's Encrypt）
4. 免费 CDN
5. 可回滚的部署历史记录 - 犯错也不怕

对我这样每个月不过几千访问量的博客来说，firebase 的免费档应该是绰绰有余。一旦出现不够用的情况，还可以考虑 Blaze 方案 - 即用即付。

## 创建项目

首先登录 [https://console.firebase.google.com](https://console.firebase.google.com) 创建一个新项目。注意，创建过程中页面会默认生成一个 Project ID，我们也可以自己填写，它将决定我们的网站托管在 firebase 上的子域名，比如你填入 `google`，则最后你的博客将托管在 google.firebase.com 域名 - 只不过一旦创建后就不能再修改。

## 安装 Firebase 命令行工具

我们需要预先安装 `firebase-tools`，这是一个基于 Node.js 的工具包，我们需要通过 `npm` 或是 `yarn` 来安装：

```bash
$ yarn global add firebase-tools
```

安装完成后，命令行下就有 `firebase` 命令供差遣。

## firebase login

在终端窗口执行 `firebase login`，浏览器会自动打开一个请求授权的网址，但这个网址授权后会跳到 `localhost` 地址，就我经历来说，挂了代理后，这个地址跳不动。

所以要换成如下命令：

```bash
$ firebase login --no-localhost
```

这样授权后不会跳到 `localhost`，而是返回一串 token，将该 token 拷入命令行回车即可完成登录。

## 初始化 firebase

命令行下登录 firebase 后，切换到博客根目录，初始化：

```bash
$ cd blog.zfanw.com
$ firebase init

     🔥🔥🔥🔥🔥🔥🔥🔥 🔥🔥🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥     🔥🔥🔥     🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥
     🔥🔥        🔥🔥  🔥🔥     🔥🔥 🔥🔥       🔥🔥     🔥🔥  🔥🔥   🔥🔥  🔥🔥       🔥🔥
     🔥🔥🔥🔥🔥🔥    🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥   🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥
     🔥🔥        🔥🔥  🔥🔥    🔥🔥  🔥🔥       🔥🔥     🔥🔥 🔥🔥     🔥🔥       🔥🔥 🔥🔥
     🔥🔥       🔥🔥🔥🔥 🔥🔥     🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥     🔥🔥  🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥

You're about to initialize a Firebase project in this directory:

  /Users/sam/Documents/githubRepos/blog.zfanw.com

? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, then Ente
r to confirm your choices. (Press <space> to select)
❯◯ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
 ◯ Functions: Configure and deploy Cloud Functions
 ◯ Hosting: Configure and deploy Firebase Hosting sites
 ◯ Storage: Deploy Cloud Storage security rules
```

因为我们只是要托管静态博客，所以选择 `Hosting: Configure and deploy Firebase Hosting sites`。

稍后会让我们关联一个 Firebase 项目，选择我们在 firebase 后台新建的项目。

再往后则是：

```bash
? What do you want to use as your public directory? (public)
```

因为我的静态博客在构建后是放在 `dist` 目录的，所以这里我填入 `dist` - 默认为 `public` 目录。

最终，`firebase init` 命令会生成两个文件：

1. firebase.json
2. .firebaserc

我们主要关心 [`firebase.json`](https://firebase.google.com/docs/hosting/full-config)，这里面可以做很多事情，比如设置静态资源的缓存时间：

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 预览

在部署之前，我们可以执行 `firebase serve` 预览一下，省得部署后才发现有问题：

```bash
$ firebase serve

=== Serving from '/Users/sam/Documents/githubRepos/blog.zfanw.com'...

i  hosting: Serving hosting files from: dist
✔  hosting: Local server: http://localhost:5000
```

## 部署

接下来就可以部署：

```bash
$ firebase deploy --only hosting
```

## 自定义域名

部署完成后，我们就能在 `<Project-ID>.firebaseapp.com` 这样一个网址访问到博客，接下来就是[关联我们的自定义域名](https://firebase.google.com/docs/hosting/custom-domain?hl=zh-cn)。`Hosting` 面板下有相应操作指南，这里就略过不提。

不过，配置完自定义域名后，我们会有两个网址：

1. `<Project-ID>.firebaseapp.com`
2. `你的自定义域名.com`

前者是关不掉的。这是一个问题，因为搜索引擎会从两个网址抓取到一样的内容，对 SEO 来讲，这非常糟糕，搜索引擎可能会判断为内容抄袭、重复，导致你的自定义域名被降权。所以最好使用 [rel=canonical](https://support.google.com/webmasters/answer/139066?hl=zh-Hant) 之类的方案给搜索引擎一个说明。

比如我的博客首页 HTML 代码中会有这样一行：

```html
<link rel="canonical" href="https://blog.zfanw.com/"/>
```
## 体验

快，比托管在 VPS 上确实快得多。

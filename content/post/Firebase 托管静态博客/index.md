---
title: Firebase 托管静态博客
date: 2018-07-30
permalink: /firebase-hosting-static-site
---

我的博客就是些静态 HTML 文件，一向都部署在 VPS 上，但最近觊觎 CDN 的速度，于是调查一番，选了 firebase 来托管博客，看看效果如何。

firebase 提供的免费托管特性如下：

1. 可存储的免费空间为 1 GB
2. 每个月免费流量为 10 GB
3. 可免费自定义域名，并配有 SSL 证书（Let's Encrypt）
4. 免费 CDN
5. 可回滚的历史记录 - 犯错不可怕

对我这样每个月不过几千访问量的博客来说，firebase 的免费档应该是绰绰有余。如果不够，还可以考虑 Blaze 方案 - 即用即付。

不过，在中国境内使用 firebase 可谓困难重重 - 全程代理还不够。

## Firebase 命令行工具

firebase 命令行工具是基于 Node.js 的，所以我们需要通过 npm 或是 yarn 来安装：

```bash
$ npm install -g firebase-tools
```
安装完成后，命令行下就有 `firebase` 命令供你差遣。

## 创建项目

登录 [https://console.firebase.google.com](https://console.firebase.google.com)，然后添加一个项目。

## firebase login

在命令行执行 `firebase login`，浏览器中自动打开一个请求授权的网址，但这个网址授权后会跳到 `localhost` 地址，就我经历来说，挂了代理后，这个地址就跳不动。

所以要换成如下命令：

```bash
$ firebase login --no-localhost
```
这样授权后不会跳到 `localhost`，而是返回一串 token，将 token 拷入命令行回车即可完成登录。

## 初始化 firebase

命令行下登录 firebase 后，切换到博客根目录，初始化：

```bash
$ cd my-blog
$ firebase init
```
会看到许多提示，主要是设置 `public` 目录，比如我的博客在构建后，要部署的文件全在 `dist` 下，则我要填入 `dist`，而不是使用默认的 `public` 目录。

最终，该命令会生成两个文件：

1. firebase.json
2. .firebaserc

我们主要关心 [`firebase.json`](https://firebase.google.com/docs/hosting/deploying#section-firebase-json)，这里面可以做很多事情，比如设置静态资源的缓存时间：

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
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
很遗憾，这里有个[存活多年的 bug](https://github.com/firebase/firebase-tools/issues/155)，`deploy` 命令在代理后面无法部署内容。

中国区人民顿时陷入死循环 - 关了代理肯定部署不了，开着代理也部署不了。

一个[极度粗暴的解决办法](https://github.com/firebase/firebase-tools/issues/155#issuecomment-253255836)是这样：

1. `which firebase` 找出 `firebase` 命令的地址
    ```bash
    $ which firebase
    /usr/local/bin/firebase
    ```
2. `ls -l /usr/local/bin/firebase` 找出 `firebase` 真实地址
    ```bash
    $ ls -l /usr/local/bin/firebase
    lrwxr-xr-x  1 sam  admin  79 Jul 29 13:52 /usr/local/bin/firebase -> ../../../Users/sam/.config/yarn/global/node_modules/firebase-tools/bin/firebase
    ```
3. 这样我就知道 `firebase` 安装包的位置：
    ```bash
    $ cd /Users/sam/.config/yarn/global/node_modules/firebase/node_modules/faye-websocket/lib/faye/websocket/
    $ vim client.js
    ```
4. 调整代理如下：
    ```js
    - var proxy      = options.proxy || {}
    + var proxy      = options.proxy || {
    +    origin: 'http://localhost:1087', // 你的电脑上代理的地址
    +    headers: {'User-Agent': 'node'}  
    + }
    ```
现在再运行 `firebase deploy` 就强制它走代理了。

## 自定义域名

部署完成后，我们就能在 <YOUR-FIREBASE-APP>.firebaseapp.com 这样一个网址访问到博客，接下来就是[关联我们的自定义域名](https://firebase.google.com/docs/hosting/custom-domain?hl=zh-cn)。`Hosting` 面板下有相应操作指南，这里就略过不提。

不过，配置完自定义域名后，我们会有两个网址：

1. `<YOUR-FIREBASE-APP>.firebaseapp.com`
2. `你的自定义域名.com`

前者是关不掉的。这是一个问题，因为搜索引擎会从两个网址抓取到一样的内容，对 SEO 来讲，这非常糟糕，最好使用 [rel=canonical](https://support.google.com/webmasters/answer/139066?hl=zh-Hant) 之类的方案给搜索引擎一个说明。

## 体验

快，比托管在 VPS 上确实快得多。
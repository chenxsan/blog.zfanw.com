---
title: React.js 跨域开发
date: 2018-03-01
permalink: /react-js-cors
excerpt: 开发 React.js 单页面应用时，前后端分离情况下，如何处理 API 请求跨域问题。
tags:
  - React.js
---

我们用 React.js 开发单页面应用时，通常后端 API 与前端开发服务器并不在一个域内：

* React.js 开发服务器运行在 localhost:3000
* API 服务器运行在 localhost:4200

然后我们在浏览器控制台就会看到错误提示：

> XMLHttpRequest cannot load http://localhost:4200. Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access.

我们可以在 API 服务器定义 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 响应头来解决。

但如果最终部署时，前端文件跟后端 API 是在同一个域内的 - 定义 CORS 则显得多余。

## create-react-app

如果你使用 `create-react-app` 开发 React 项目，则可以使用它的 [proxy 功能](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development)。我们需要在 `package.json` 文件中新增一个字段：

```json
{
  "proxy": "http://localhost:4200"
}
```
这样，React 项目中 API 请求就会转发到 `http://localhost:4200`，不再有跨域的问题。

## CaddyServer

[Caddy](https://caddyserver.com/) 是类似 nginx、Apache 的服务器软件，但我们在 React.js 项目开发中可以用它来[代理 API 请求](https://caddyserver.com/docs/proxy)。

在安装 Caddy 服务器后，新建一个 `caddyfile`，假定内容如下：

```
# Caddy 服务器运行的主机、端口
localhost:3002
# 假定 React 开发服务器运行在 localhost:3000 端口
proxy / http://localhost:3000
proxy /sockjs-node localhost:300 {
  websocket
}
proxy /api http://localhost:4200
```
接着在命令行下启动 caddy：

```bash
$ caddy --conf ./caddyfile
```
随后我们就可以在 `localhost:3002` 访问 React.js 页面 - 注意不是 `localhost:3000`。caddy 会将 `/` 请求转发到 3000 端口，而 `/api` 请求则转发到 `http://localhost:4200`，一样解决跨域问题。
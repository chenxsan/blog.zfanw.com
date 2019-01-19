---
title: Google 搜索的 URL 参数
date: 2012-12-06T05:37:23+00:00
permalink: /google-search-url-parameters
excerpt: 了解 Google 搜索支持的 URL 参数，更高效地使用 Google。
tags:
  - Google
---

我们在 Google 搜索时，其实就是访问一个 URL。

## tl;dr

搜索参数|作用|示例
---|---|---
num|设定一页内显示的搜索结果数量|num=1
lr|限制搜索结果的语言|lr=lang_ja
cr|限制站点的托管服务器所在国|cr=countryJP
hl|限制 Google 搜索的界面语言|hl=zh-CN
as_qdr|限制时间|as_qdr=w3

## 限制搜索结果数目

默认情况下，Google 搜索一页显示 10 个搜索结果。我们可以通过「搜索设置」调整显示的数目，同样我们也可以通过 URL 参数来调整。

举个例子：

```
https://www.google.com/search?q=vimperator&num=1
```

我们的搜索关键词是 `vimperator`，URL 末尾的 `num=1` 表示一页只显示 1 个搜索结果。注意，`num` 取值范围为 1 至 100，并且不能开启 「Google 即搜即得联想功能」。

## 限制搜索结果的语言

如果你了解 vimperator，可能会知道 vimperator 相关的内容有很多是日语 – 因为有维护者来自日本，许多插件的开发者也多来自日本。如果我们想限制 Google 的搜索结果里只包含日语，你可能马上想到打开 Google.co.jp 网站，但其实仍会搜出大量英文。

此时我们可以考虑使用 `lr=lang_ja` 来限制搜索结果语言为日语。

`lr` 指 language restrict - 语言限制。如果你想限制某个语言，但不知道具体的 language code 是什么，可以查阅 [Google 提供的 language 文档](https://developers.google.com/custom-search/docs/ref_languages)。

## 限制目标网站的地理位置

上面我们使用 `lr` 来限制搜索结果的语言，更进一步，我们还可以通过 `cr=countryJP` 来限制搜索结果仅显示服务器位置处于日本的站点 - `cr` 表示 country restrict - 国家限制：

```
https://www.google.com/search?q=vimperator&lr=lang_ja&cr=countryJP
```
具体的 `country..` 编码可以查看 [ 	
AdWords API Location Criteria](https://fusiontables.google.com/DataSource?docid=1IYYsfUXLaXOXUk8mG0thJC3se1Y3gdl1bFiP3ONp#rows:id=1) 中的 `Country Code` 一列 - 注意 `country` 后的俩个字符需要大写。

## 设定 Google 界面语言

很多时候，Google 会根据你的地理位置帮你决定界面语言 - 比如我使用日本的代理服务器，则 Google 就显示日文菜单给我 - 我目前并不懂日文，希望换成英文或是中文，则可以添加 `hl`：
```
https://www.google.com/search?q=vimperator&lr=lang_ja&cr=countryJP&hl=zh-CN
```

参数 `hl`([host language](https://developers.google.com/custom-search/docs/xml_results?hl=en#hlsp))用于修改 Google 搜索界面的语言，比如简体中文是 `zh-cn`，台湾正体是 `zh-tw`，香港繁体则是 `zh-hk`。如果不知道自己的语言对应的代码，请查阅 Google 提供的[语言代码文档](https://developers.google.com/custom-search/docs/xml_results_appendices#interfaceLanguages)。

## 限制时间

Google 的搜索工具里提供限制时间的功能，比如「过去1小时」，「过去24小时」，「过去1周」，甚至是自定义某一段日期。这些功能也可以通过 URL 参数 `as_qdr=..` (as 表示 Advanced search，qdr 可能表示 [query date range](https://www.mattcutts.com/blog/useful-google-feature-better-date-search/))完成。

比如 `as_qdr=m2` 表示过去两个月，`as_qdr=y2` 表示过去两年，`as_qdr=d2` 表示过去两天，`as_qdr=s3` 表示过去3秒内，`w` 表示一周，`s` 表示秒，`n` 表示分钟，`h` 表示小时。
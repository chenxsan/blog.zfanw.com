---
title: Modernizr 用法
date: 2013-06-11T06:45:32+00:00
permalink: /modernizr
tags:
  - modernizr
  - 前端开发
---

## Modernizr 是什么

> Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.

Modernizr 是一个 JavaScript 库，可以检测用户浏览器的 HTML5、CSS3 特性的支持状况。

## 为什么用 Modernizr

世上如果只有一种浏览器就好了。每年的生日我都要许这样一个愿。

但现实是，我们有 Chrome、Safari、Firefox、IE、Edge、Opera，还有各种国产的、你可能闻所未闻的浏览器，而且每个浏览器还有很多版本。它们有的支持 `<input type='date' />`，有的支持 Battery API，有的甚至连 `display: inline-block` 都不支持。总之，有各种你想得到的、想不到的意外情况。

面对这样的浏览器市场，我们有一个选择：根据特性的支持状态，为浏览器量身定制页面。这正是 Modernizr 的作用。

### 下载 Modernizr

首先，从 [Modernizr 下载页面](https://modernizr.com/download)选择你打算检测的特性，然后点击 BUILD，下载一份定制的 Modernizr 文件，保存到本地。

在你的 HTML 页面引用它：

```html
<script src="modernizr-custom.js"></script>
```
如果你对在哪个位置插入上述代码有疑问，可以查看 [paulirish 在 github 上的说明](https://github.com/Modernizr/Modernizr/issues/878#issuecomment-41448059)。

## 特性支持状况一览

在浏览器中打开 html 页面，启用开发者工具，你可以看到类似以下的代码：

```html
<html class=" htmlimports flash no-proximity sizes transferables applicationcache blobconstructor blob-constructor cookies cors customprotocolhandler customevent eventlistener geolocation history customelements dataview no-ie8compat json messagechannel notification postmessage queryselector serviceworker svg templatestrings typedarrays websockets no-xdomainrequest webaudio cssescape supports target no-microdata mutationobserver passiveeventlisteners picture es5array es5date es5function es5object strictmode es5string es5syntax es5undefined es5 no-es6array arrow es6collections generators es6math es6number es6object promises es6string devicemotion deviceorientation filereader beacon no-lowbandwidth eventsource fetch xhrresponsetype xhr2 speechsynthesis localstorage sessionstorage websqldatabase svgfilters urlparser urlsearchparams no-contains no-contextmenu cssall willchange classlist documentfragment websocketsbinary atobbtoa atob-btoa no-framed sharedworkers webworkers no-ambientlight hashchange inputsearchevent pointerevents audio canvas contenteditable canvastext emoji olreversed no-userdata video no-vml webanimations webgl adownload audioloop canvasblending todataurljpeg todataurlpng todataurlwebp canvaswinding bgpositionshorthand csscalc cubicbezierrange cssgradients multiplebgs opacity csspointerevents csspositionsticky cssremunit rgba preserve3d no-createelementattrs no-createelement-attrs dataset hidden outputelem progressbar meter ruby template no-time texttrackapi track unknownelements no-capture fileinput fileinputdirectory formattribute placeholder sandbox no-seamless srcdoc imgcrossorigin srcset inputformaction input-formaction inputformenctype input-formenctype inputformmethod no-inputformtarget no-input-formtarget scriptasync scriptdefer no-stylescoped inlinesvg textareamaxlength videocrossorigin videoloop videopreload mediaqueries no-hiddenscroll no-mathml no-touchevents unicoderange unicode checked displaytable display-table fontface generatedcontent hairline cssinvalid lastchild nthchild cssscrollbar siblinggeneral subpixelfont cssvalid details oninput formvalidation hovermq pointermq svgasimg datalistelem no-localizednumber csschunit cssexunit hsla cssvhunit cssvwunit bdi cssvmaxunit cssvminunit xhrresponsetypearraybuffer xhrresponsetypeblob xhrresponsetypedocument xhrresponsetypejson xhrresponsetypetext svgclippaths svgforeignobject smil textshadow no-batteryapi no-battery-api no-dart no-forcetouch gamepads crypto fullscreen intl pagevisibility performance pointerlock quotamanagement requestanimationframe raf vibrate no-webintents no-lowbattery getrandomvalues backgroundblendmode objectfit object-fit no-regions no-wrapflow filesystem no-requestautocomplete speechrecognition bloburls getusermedia peerconnection datachannel matchmedia ligatures cssanimations csspseudoanimations appearance no-backdropfilter backgroundcliptext bgpositionxy bgrepeatround bgrepeatspace backgroundsize bgsizecover borderimage borderradius boxshadow boxsizing csscolumns csscolumns-width csscolumns-span csscolumns-fill csscolumns-gap csscolumns-rule csscolumns-rulecolor csscolumns-rulestyle csscolumns-rulewidth csscolumns-breakbefore csscolumns-breakafter csscolumns-breakinside no-cssgridlegacy cssgrid no-displayrunin no-display-runin ellipsis cssfilters flexbox flexboxlegacy no-flexboxtweener flexwrap cssmask no-overflowscrolling cssreflections cssresize no-scrollsnappoints shapes textalignlast csstransforms csstransforms3d no-csstransformslevel2 csstransitions csspseudotransitions userselect no-exiforientation apng webpalpha webpanimation webplossless webp no-jpeg2000 no-jpegxr webp-alpha webp-animation webp-lossless datauri indexeddb audiopreload videoautoplay indexeddb-deletedatabase dataworkers blobworkers csshyphens softhyphens softhyphensfind">
```
这些便是 Modernizr 检查出的 Chrome 浏览器的 HTML5、CSS3 的支持状况。没有 `no-` 的表示浏浏览器支持该特性。

通过这些 css 类，我们便可以有针对地写一些 css 规则。

比如某个不支持 flexbox 的浏览器，我们需要额外写一些规则，防止布局错乱：

```css
.no-flexbox {
  .main {
    display: block;
    width: 100%;
  }
}
```

## Modernizr 对象

除了上面添加到 `html` 标签的 css 类外，我们还会得到一个 `window.Modernizr`，这个对象中包含浏览器特性支持的真假值。

```js
if (Modernizr.canvas) {
  // 可以使用 canvas
} else {
  // 浏览器没有原生的 canvas 支持，做一定的降级处理，或是加载 polyfills
}
```
基本上所有 HTML5 特性都有[相应的 Polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills) ，至于是否必要，就看项目需求：有时候，你可以，不一定代表你要。毕竟，在 IE6 上支持 Geolocation 这样的特性意义并不大。

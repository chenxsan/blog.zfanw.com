---
title: JavaScript undefined
date: 2018-6-19
description: JavaScript 里，undefined 既是一个类型，又是一个全局变量，同时它还是一个值。
tags:
  - JavaScript
---

声明一个变量，但不给它赋值：

```
var a
```
那么变量 `a` 的值就会默认为 `undefined`。

我们不妨这么认为：变量声明时，如果未赋值，那么系统会自动赋值 `undefined` - 实际上，[JavaScript 规范里就是这么规定的](https://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types-undefined-type) ：

>  Any variable that has not been assigned a value has the value `undefined`

换句话说，`var a` 与 `var a = undefined` 是等效的。

## undefined 变量

上面说，`undefined` 是一个值，实际上，它还是一个变量。

我们知道，JavaScript 下值是不能赋值的，比如我们写：

```js
5 = 6
```
浏览器就会报错：

> Uncaught ReferenceError: Invalid left-hand side in assignment

但我们可以写：

```js
undefined = 6
```
没有报错。因为这里的 `undefined` 是全局环境中的变量 - 浏览器下是 `window.undefined`，Node.js 下则是 `global.undefined`。

那么，此时 `undefined` 变量的值是 6 吗？

我们可以检查一下：

```js
undefined === 6
```
结果是 `false`。这是因为，`undefined` 是不可写（Writable: false）的，[Writable 定义里说](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Writable_attribute)：

> trying to write into the non-writable property doesn't change it but doesn't throw an error either

尝试给 Writable: false 的属性赋值不会改变它的值，但也不会抛出错误。

## Undefined 类型

JavaScript 有六大基础类型：

1. String
2. Number
3. Boolean
4. Undefined
5. Null
6. Symbol（ES2015 新增的）

String、Number 类型都有很多值，Boolean 只有两个值，而 Undefined 类型则只有一个 `undefined` 值。是了，我把它称作 JavaScript 里的三位一体，它既表示基础类型，又表示变量名，还表示值。

## 判断 undefined

如前所述，因为 `undefined` 即是基础类型，又是值，所以理论上，判断一个变量值是否 `undefined`，我们有两种方案：

1. `x === undefined`
2. `typeof x === 'undefined'`

当然，后者要更为保险。在 `x` 变量未曾声明的情况下，后者不会抛出错误，前者会抛出 `ReferenceError: x is not defined` 的错误。
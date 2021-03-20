# SIMD

## 简介

> 摘要来自：https://www.bookstack.cn/read/es6-3rd/spilt.1.docs-simd.md

SIMD（发音/sim-dee/）是“Single Instruction/Multiple Data”的缩写，意为“单指令，多数据”。它是 JavaScript 操作 CPU 对应指令的接口，你可以看做这是一种不同的运算执行模式。与它相对的是 SISD（“Single Instruction/Single Data”），即“单指令，单数据”。

SIMD 的含义是使用一个指令，完成多个数据的运算；SISD 的含义是使用一个指令，完成单个数据的运算，这是 JavaScript 的默认运算模式。显而易见，SIMD 的执行效率要高于 SISD，所以被广泛用于 3D 图形运算、物理模拟等运算量超大的项目之中。

## 情况

详见项目：https://github.com/WebAssembly/simd

目前已经在 [TC39](https://github.com/tc39) 中移除，专注于 Webassembly 中构建，原项目地址：https://github.com/tc39/ecmascript_simd

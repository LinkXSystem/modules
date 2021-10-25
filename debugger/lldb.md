# LLDB 笔记

## 流程练习

- C 文件编译命令：

```shell
# -g 参数保证 lldb 显示的是源代码而不是汇编代码
gcc example.c -g -o example
```

- 调试文件

```shell
lldb example
```

- 设置断点

```shell
br set -n main

# help 可以查看子命令
help br
```

- 运行命令

```shell
# 启动程序运行
run

# 跳入内函数
step

# 执行下一行
next
```

- 查看当前的变量

```shell
frame variable
```

- 查询线程堆栈信息

```shell
thread backtrace

# 查看子命令
help thread
```

## 参考文档

- [LLDB Tutorial](https://lldb.llvm.org/use/tutorial.html)

# 单调队列

![Head Figure](https://pic4.zhimg.com/80/v2-ef66afc38e068600939980673114127f_1440w.jpg)

单调队列是一种主要用于解决滑动窗口类问题的数据结构，即，在长度为 $n$ 的序列中，求每个长度为 $m$ 的区间的区间最值。它的时间复杂度是 $O(n)$ ，在这个问题中比 $O(n log n)$ 的ST表和线段树要优。

单调队列的基本思想是，维护一个双向队列（deque），遍历序列，仅当一个元素可能成为某个区间最值时才保留它。

## References

- [1] 算法学习笔记(66): 单调队列: https://zhuanlan.zhihu.com/p/346354943
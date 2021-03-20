# 稀疏表

![Head Figure](https://pic2.zhimg.com/v2-dc17bb725be32d63fa7242c9ed34f933_1440w.jpg?source=172ae18b)

ST表（Sparse Table，稀疏表）是一种简单的数据结构，主要用来解决RMQ（Range Maximum/Minimum Query，区间最大/最小值查询）问题。它主要应用倍增的思想，可以实现 $O(n\log n)$ 预处理、 $O(1)$ 查询。

所谓RMQ问题，以最大值为例，是假如有一个数列 $A$ ，给你一个区间 $[l, r]$ ，要求 $\max\limits_{i\in[l,r]}(A_i)$ 。

ST表使用一个二维数组f，对于范围内的所有f[a][b]，先算出并存储 $\max\limits_{i\in[a,a+2^b)}(A_i)$ （本文中的区间都是离散意义下的，只包含整数，所以此区间也可以写成 $\left[a,a+2^b-1\right]$ ），这称为预处理。查询时，再利用这些子区间算出待求区间的最大值。

## 例题

- 洛谷P2880 平衡的阵容 Balanced Lineup

    题目描述：
    每天,农夫 John 的N(1 <= N <= 50,000)头牛总是按同一序列排队. 有一天, John 决定让一些牛们玩一场飞盘比赛. 他准备找一群在对列中为置连续的牛来进行比赛. 但是为了避免水平悬殊,牛的身高不应该相差太大. John 准备了Q (1 <= Q <= 200,000) 个可能的牛的选择和所有牛的身高 (1 <= 身高 <= 1,000,000). 他想知道每一组里面最高和最低的牛的身高差别.

    输入格式：
    第1行：N,Q
    第2到N+1行：每头牛的身高
    第N+2到N+Q+1行：两个整数A和B，表示从A到B的所有牛。（1<=A<=B<=N）

    输出格式：
    输出每行一个数，为最大数与最小数的差

解答：

```c++
#include <bits/stdc++.h>
#define MAXN 50005
using namespace std;

int read()
{
    int ans = 0;
    char c = getchar();
    while (!isdigit(c))
        c = getchar();
    while (isdigit(c))
    {
        ans = ans * 10 + c - '0';
        c = getchar();
    }
    return ans;
}

int Log2[MAXN], Min[MAXN][17], Max[MAXN][17];

int main()
{
    int n = read(), m = read();
    for (int i = 1; i <= n; ++i)
    {
        int x = read();
        Min[i][0] = x;
        Max[i][0] = x;
    }
    for (int i = 2; i <= n; ++i)
        Log2[i] = Log2[i / 2] + 1;
    for (int i = 1; i <= 16; ++i)
        for (int j = 1; j + (1 << i) - 1 <= n; ++j)
        {
            Min[j][i] = min(Min[j][i - 1], Min[j + (1 << (i - 1))][i - 1]);
            Max[j][i] = max(Max[j][i - 1], Max[j + (1 << (i - 1))][i - 1]);
        }
    for (int i = 0; i < m; ++i)
    {
        int l = read(), r = read();
        int s = Log2[r - l + 1];
        int ma = max(Max[l][s], Max[r - (1 << s) + 1][s]);
        int mi = min(Min[l][s], Min[r - (1 << s) + 1][s]);
        printf("%d\n", ma - mi);
    }
    return 0;
}
```

## References

[1] 算法学习笔记(12): ST表: <https://zhuanlan.zhihu.com/p/105439034>

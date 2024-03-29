# 树状数组

![Head Figure](https://pic2.zhimg.com/v2-fbaeb49fdbad31a211fe37f068ca8bb0_1440w.jpg?source=172ae18b)

树状数组（Binary Index Tree, BIT），最简单的树状数组支持两种操作，时间复杂度均为$O(log n)$：

- 单点修改：更改数组中一个元素的值
- 区间查询：查询一个区间内所有元素的和

## 主要操作

lowbit 的公式：

$$
lowbit(x) = (x) & (-x)
$$

以下为 树状数组 的主要操作：

- 单点修改

```c++
int tree[MAXN];

inline void update(int i, int x)
{
    for (int pos = i; pos < MAXN; pos += lowbit(pos)) {
        tree[pos] += x;
    }    
}
```

- 区间查询

```c++
inline int query(int a, int b)
{
    return query(b) - query(a - 1);
}
```

- 求前 n 项和

```c++
inline int query(int n)
{
    int ans = 0;
    for (int pos = n; pos; pos -= lowbit(pos)) {
        ans += tree[pos];
    }
    return ans;
}
```

## 例题

- （HDU P1166）敌兵布阵

    题目描述：
    C国的死对头A国这段时间正在进行军事演习，所以C国间谍头子Derek和他手下Tidy又开始忙乎了。A国在海岸线沿直线布置了N个工兵营地,Derek和Tidy的任务就是要监视这些工兵营地的活动情况。由于采取了某种先进的监测手段，所以每个工兵营地的人数C国都掌握的一清二楚,每个工兵营地的人数都有可能发生变动，可能增加或减少若干人手,但这些都逃不过C国的监视。
    中央情报局要研究敌人究竟演习什么战术,所以Tidy要随时向Derek汇报某一段连续的工兵营地一共有多少人,例如Derek问:“Tidy,马上汇报第3个营地到第10个营地共有多少人!”Tidy就要马上开始计算这一段的总人数并汇报。但敌兵营地的人数经常变动，而Derek每次询问的段都不一样，所以Tidy不得不每次都一个一个营地的去数，很快就精疲力尽了，Derek对Tidy的计算速度越来越不满:"你个死肥仔，算得这么慢，我炒你鱿鱼!”Tidy想：“你自己来算算看，这可真是一项累人的工作!我恨不得你炒我鱿鱼呢!”无奈之下，Tidy只好打电话向计算机专家Windbreaker求救,Windbreaker说：“死肥仔，叫你平时做多点acm题和看多点算法书，现在尝到苦果了吧!”Tidy说："我知错了。。。"但Windbreaker已经挂掉电话了。Tidy很苦恼，这么算他真的会崩溃的，聪明的读者，你能写个程序帮他完成这项工作吗？不过如果你的程序效率不够高的话，Tidy还是会受到Derek的责骂的。

    输入格式：
    第一行一个整数 T ，表示有 T 组数据。
    每组数据第一行一个正整数 N（N<=50000）,表示敌人有 N 个工兵营地，接下来有 N 个正整数,第 i 个正整数 ai 代表第 i 个工兵营地里开始时有 ai 个人（1<=ai<=50）。
    接下来每行有一条命令，命令有4种形式：
    (1) Add i j,i 和 j 为正整数,表示第i个营地增加 j 个人（ j 不超过30）
    (2) Sub i j,i 和 j 为正整数,表示第i个营地减少 j 个人（ j 不超过30）;
    (3) Query i j,i 和 j 为正整数,i<=j，表示询问第 i 到第 j 个营地的总人数;
    (4)End 表示结束，这条命令在每组数据最后出现;
    每组数据最多有40000条命令

    输出格式：
    对第i组数据,首先输出 “Case i:” 和回车,
    对于每个 Query 询问，输出一个整数并回车,表示询问的段中的总人数,这个数保持在 int 以内。

解答：

```c++
#include <cstdio>
#include <cstring>

#define MAXN 50005
#define lowbit(x) ((x) & (-x))

int tree[MAXN];

inline void update(int i, int x)
{
    for (int pos = i; pos < MAXN; pos += lowbit(pos)) {
        tree[pos] += x;
    }
}

inline int query(int n)
{
    int ans = 0;
    for (int pos = n; pos; pos -= lowbit(pos)) {
        ans += tree[pos];
    }
    return ans;
}

inline int query(int a, int b)
{
    return query(b) - query(a - 1);
}

int main()
{
    int cases;
    scanf("%d", &cases);
    for (int I = 1; I <= cases; ++I)
    {
        memset(tree, 0, sizeof(tree));
        int n, x, a, b;
        char opr[10];
        printf("Case %d:\n", I);
        scanf("%d", &n);

        for (int i = 1; i <= n; ++i)
        {
            scanf("%d", &x);
            update(i, x);
        }

        while (scanf("%s", opr), opr[0] != 'E')
        {
            switch (opr[0])
            {
            case 'A':
                scanf("%d%d", &a, &b);
                update(a, b);
                break;
            case 'S':
                scanf("%d%d", &a, &b);
                update(a, -b);
                break;
            case 'Q':
                scanf("%d%d", &a, &b);
                printf("%d\n", query(a, b));
            }
        }
    }

    return 0;
}
```

## References

[1] 算法学习笔记(2) : 树状数组: https://zhuanlan.zhihu.com/p/93795692

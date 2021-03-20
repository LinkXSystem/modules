# 种类并查集

![Head Figure](https://pic4.zhimg.com/v2-d86d178ed411c7c0d98402359efe5360_1440w.jpg?source=172ae18b)

一般的并查集，维护的是具有连通性、传递性的关系，例如亲戚的亲戚是亲戚。但是，有时候，我们要维护另一种关系：敌人的敌人是朋友。种类并查集就是为了解决这个问题而诞生的。

## 例题

- 洛谷P1525 关押罪犯

    题目描述：
    S 城现有两座监狱，一共关押着 N 名罪犯，编号分别为 1-N 。他们之间的关系自然也极不和谐。很多罪犯之间甚至积怨已久，如果客观条件具备则随时可能爆发冲突。我们用“怨气值”（一个正整数值）来表示某两名罪犯之间的仇恨程度，怨气值越大，则这两名罪犯之间的积怨越多。如果两名怨气值为 c 的罪犯被关押在同一监狱，他们俩之间会发生摩擦，并造成影响力为 c 的冲突事件。
    每年年末，警察局会将本年内监狱中的所有冲突事件按影响力从大到小排成一个列表，然后上报到 S 城 Z 市长那里。公务繁忙的 Z 市长只会去看列表中的第一个事件的影响力，如果影响很坏，他就会考虑撤换警察局长。
    在详细考察了 N 名罪犯间的矛盾关系后，警察局长觉得压力巨大。他准备将罪犯们在两座监狱内重新分配，以求产生的冲突事件影响力都较小，从而保住自己的乌纱帽。假设只要处于同一监狱内的某两个罪犯间有仇恨，那么他们一定会在每年的某个时候发生摩擦。
    那么，应如何分配罪犯，才能使 Z 市长看到的那个冲突事件的影响力最小？这个最小值是多少？

    输入格式：
    每行中两个数之间用一个空格隔开。第一行为两个正整数 N, M ，分别表示罪犯的数目以及存在仇恨的罪犯对数。接下来的 MM 行每行为三个正整数$a_j,b_j,c_j$ ，表示$a_J$号和$b_j$号罪犯之间存在仇恨，其怨气值为$c_j$ 。数据保证$1<a_j≤b_j≤N ,0 < c_j≤ 1,000,000,000$，且每对罪犯组合只出现一次。

    输出格式：
    共 1 行，为 Z 市长看到的那个冲突事件的影响力。如果本年内监狱中未发生任何冲突事件，请输出 0 。

解答：

```c++
#include <cstdio>
#include <cctype>
#include <algorithm>

int read() // 快速读入，可忽略
{
    int ans = 0;
    char c = getchar();
    while (!isdigit(c))
        c = getchar();
    while (isdigit(c))
    {
        ans = (ans << 3) + (ans << 1) + c - '0';
        c = getchar();
    }
    return ans;
}

struct data  // 以结构体方式保存便于排序
{
    int a, b, w;
} C[100005];

int cmp(data &a, data &b)
{
    return a.w > b.w;
}

int father[40005], rank[40005];  // 以下为并查集

int find(int a)
{
    return (father[a] == a) ? a : (father[a] = find(father[a]));
}

int query(int a, int b)
{
    return find(a) == find(b);
}

void merge(int a, int b)
{
    int x = find(a), y = find(b);
    if (rank[x] >= rank[y])
        father[y] = x;
    else
        father[x] = y;
    if (rank[x] == rank[y] && x != y)
        rank[x]++;
}

void init(int n)
{
    for (int i = 1; i <= n; ++i)
    {
        rank[i] = 1;
        father[i] = i;
    }
}

int main()
{
    int n = read(), m = read();
    init(n * 2); // 对于罪犯i，i+n为他的敌人
    for (int i = 0; i < m; ++i)
    {
        C[i].a = read();
        C[i].b = read();
        C[i].w = read();
    }
    std::sort(C, C + m, cmp);
    for (int i = 0; i < m; ++i)
    {
        if (query(C[i].a, C[i].b))  // 试图把两个已经被标记为“朋友”的人标记为“敌人”
        {
            printf("%d\n", C[i].w); // 此时的怒气值就是最大怒气值的最小值
            break;
        }
        merge(C[i].a, C[i].b + n);
        merge(C[i].b, C[i].a + n);
        if (i == m - 1)  // 如果循环结束仍无冲突，输出0
            puts("0");
    }
    return 0;
}
```

## References

[1] 算法学习笔记(7)：种类并查集: https://zhuanlan.zhihu.com/p/97813717
# 并查集

![Head Figure](https://pic2.zhimg.com/v2-6362d8b13705d5ba17b19cdeee453022_1440w.jpg?source=172ae18b)

并查集主要用于解决一些元素分组的问题。它管理一系列不相交的集合，并支持两种操作：

- 合并（Union）：把两个不相交的集合合并为一个集合
- 查询（Find） ：查询两个元素是否在同一个集合中

## 主要操作

- 初始化

```c++
int father[MAXN];
inline void init(int n)
{
    for (int i = 1; i <= n; ++i)
    {
        father[i] = i;
    } 
}
```

假如有编号为1, 2, 3, ..., n的n个元素，我们用一个数组fa[]来存储每个元素的父节点（因为每个元素有且只有一个父节点，所以这是可行的）。一开始，我们先将它们的父节点设为自己。

- 查询

```c++
int find(int x) {
    if(fa[x] == x)
    {
         return x;
    } 
    else
    {
        return find(fa[x]);
    }   
}
```

用递归的写法实现对代表元素的查询：一层一层访问父节点，直至根节点（根节点的标志就是父节点是本身）。要判断两个元素是否属于同一个集合，只需要看它们的根节点是否相同即可。

- 合并

```c++
inline void merge(int i, int j)
{
    father[find(i)] = find(j);
}
```

合并操作也是很简单的，先找到两个集合的代表元素，然后将前者的父节点设为后者即可。当然也可以将后者的父节点设为前者。

## 路径压缩

使用路径压缩的方法。既然我们只关心一个元素对应的根节点，那我们希望每个元素到根节点的路径尽可能短，最好只需要一步，像这样：

![root](https://pic1.zhimg.com/80/v2-c2f835398a3e54d8209bf5e034ac6820_1440w.jpg)

只要我们在查询的过程中，把沿途的每个节点的父节点都设为根节点即可。

- 合并（路径压缩）

```c++
int find(int x)
{
    if(x == fa[x])
    {
        return x;
    } 
    else
    {
        father[x] = find(father[x]);  // 父节点设为根节点
        return father[x];             // 返回父节点
    }
}
```

代码简化

```c++
int find(int x)
{
    return x == father[x] ? x : (father[x] = find(father[x]));
}
```

## 按秩合并

我们应该把简单的树往复杂的树上合并，而不是相反。因为这样合并后，到根节点距离变长的节点个数比较少。

- 初始化（按秩合并）

```c++
inline void init(int n) {
    for (int i = 1; i <= n; ++i)
    {
        fa[i] = i;
        rank[i] = 1;
    }
}
```

- 合并（按秩合并）

```c++
inline void merge(int i, int j)
{
    int x = find(i), y = find(j);    // 先找到两个根节点
    if (rank[x] <= rank[y])
    {
        father[x] = y;
    } 
    else 
    {
        father[y] = x;
    }
        
    if (rank[x] == rank[y] && x != y) 
    {
        rank[y]++;                   // 如果深度相同且根节点不同，则新的根节点的深度 +1
    }
}   
```

## 例题

- （洛谷P1551）亲戚

    题目背景：
    若某个家族人员过于庞大，要判断两个是否是亲戚，确实还很不容易，现在给出某个亲戚关系图，求任意给出的两个人是否具有亲戚关系。

    题目描述：
    规定：x和y是亲戚，y和z是亲戚，那么x和z也是亲戚。如果x,y是亲戚，那么x的亲戚都是y的亲戚，y的亲戚也都是x的亲戚。

    输入格式：
    第一行：三个整数n,m,p，（n<=5000,m<=5000,p<=5000），分别表示有n个人，m个亲戚关系，询问p对亲戚关系。
    以下m行：每行两个数Mi，Mj，1<=Mi，Mj<=N，表示Mi和Mj具有亲戚关系。
    接下来p行：每行两个数Pi，Pj，询问Pi和Pj是否具有亲戚关系。

    输出格式：
    P行，每行一个’Yes’或’No’。表示第i个询问的答案为“具有”或“不具有”亲戚关系。

解答：

```c++++
#include <cstdio>
#define MAXN 5005

int father[MAXN], rank[MAXN];

inline void init(int n)
{
    for (int i = 1; i <= n; ++i)
    {
        father[i] = i;
        rank[i] = 1;
    }
}

int find(int x)
{
    return x == father[x] ? x : (father[x] = find(father[x]));
}

inline void merge(int i, int j)
{
    int x = find(i), y = find(j);
    if (rank[x] <= rank[y])
    {
        father[x] = y;
    }
    else
    {
        father[y] = x;
    }

    if (rank[x] == rank[y] && x != y)
    {
        rank[y]++;
    }
}
int main()
{
    int n, m, p, x, y;

    scanf("%d%d%d", &n, &m, &p);

    init(n);
    for (int i = 0; i < m; ++i)
    {
        scanf("%d%d", &x, &y);
        merge(x, y);
    }

    for (int i = 0; i < p; ++i)
    {
        scanf("%d%d", &x, &y);
        printf("%s\n", find(x) == find(y) ? "Yes" : "No");
    }

    return 0;
}
```

## References

[1] 算法学习笔记(1) : 并查集: <https://zhuanlan.zhihu.com/p/93647900>

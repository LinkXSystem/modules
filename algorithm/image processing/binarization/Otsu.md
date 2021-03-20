# 大津算法

图像处理的其中一种二值化算法之一。维基上的描述是：用来自动对基于聚类的图像进行二值化，[1] 或者说，将一个灰度图像退化为二值图像。

## 方法

在大津算法中，我们穷举搜索能使类内方差最小的阈值，定义为两个类的方差的加权和：

$$
\sigma^2_w(t)=\omega_1(t)\sigma^2_1(t)+\omega_2(t)\sigma^2_2(t)
$$

权重 $\omega_i$ 是被阈值 $t$ 分开的两个类的概率，而 $\sigma_i^2$ 是这两个类的方差。

大津证明了最小化类内方差和最大化类间方差是相同的：

$$
\sigma^2_b(t)=\sigma^2-\sigma^2_w(t)=\omega_1(t)\omega_2(t)\left[\mu_1(t)-\mu_2(t)\right]^2
$$

用类概率 $\omega_i$ 和类均值 $\mu_i$ 来表示。

类概率 $\omega_1(t)$ 用阈值为 $t$ 的直方图计算：

$$
\omega_1(t)=\Sigma_0^t p(i)
$$

而类均值 $\mu _{1}(t)$ 为：

$$
\mu_1(t)=\left[\Sigma_0^t p(i)\,x(i)\right]/\omega_1
$$

其中 $x(i)$ 为第 $i$ 个直方图面元中心的值。 同样的，你可以对大于 $t$ 的面元求出右侧直方图的 $\omega_{2}(t)$ 与 $\mu_{2}$ 。

类概率和类均值可以迭代计算。

大津算法得出了0:1范围上的一个阈值。这个阈值用于图像中出现的像素强度的动态范围。例如，若图像只包含155到255之间的像素强度，大津阈值0.75会映射到灰度阈值230（而不是192，因为图像包含的像素不是0–255全范围的）。

## 实现

- JavaScript 版本

```js
function otsu(histogram, total) {
    let sum = 0;
    for (let i = 1; i < 256; ++i) {
         sum += i * histogram[i];
    }
    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let mB;
    let mF;
    let max = 0.0;
    let between = 0.0;
    let threshold1 = 0.0;
    let threshold2 = 0.0;
    for (let i = 0; i < 256; ++i) {
        wB += histogram[i];

        if (wB == 0) {
            continue;
        }
            
        wF = total - wB;
        if (wF == 0) {
            break;
        }
            
        sumB += i * histogram[i];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;
        between = wB * wF * (mB - mF) * (mB - mF);

        if ( between >= max ) {
            threshold1 = i;

            if ( between > max ) {
                threshold2 = i;
            }

            max = between;            
        }
    }
    return ( threshold1 + threshold2 ) / 2.0;
}
```

## References

- [1] 大津算法 : https://zh.wikipedia.org/wiki/%E5%A4%A7%E6%B4%A5%E7%AE%97%E6%B3%95

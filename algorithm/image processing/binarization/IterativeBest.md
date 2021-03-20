# 迭代最佳阈值

该算法先假定一个阈值，然后计算在该阈值下的前景和背景的中心值，当前景和背景中心值得平均值和假定的阈值相同时，则迭代中止，并以此值为阈值进行二值化。

## 公式

- 求出图象的最大灰度值和最小灰度值，分别记为 $g_l$ 和 $g_u$，令初始阈值为：

$$
T^0 = \frac{g_l + g_u}{2}
$$

- 根据阈值 $T^0$ 将图象分割为前景和背景，分别求出两者的平均灰度值 $A_{b}$ 和 $A_{f}$:

$$
A_b = \sum_{g=g_l}^{T^0} g \times h(g) / \sum_{g=g_l}^{T^0} h(g)
\\
A_f = \sum_{g=T^0 + 1}^{g_u} g \times h(g) / \sum_{g=T^0 + 1}^{g_u}g \times h(g)
$$

- 令

    $$
    T^k = \frac{A_b + A_f}{2}
    $$

    如果 $T^k = T^{k+1}$，则取 $T^k$ 为所求得的阈值，否则，转上一步继续迭代。

## 实现

- JavaScript 实现

```js
function IterativeBest(histogram) {
    let iter = 0;

    let minValue;
    let maxValue;

    let threshold;
    let newThreshold;

    for(minValue = 0; minValue < 256 && histogram[minValue] == 0; minValue++) {

    }

    for(maxValue = 255; maxValue > minValue && histogram[minValue] == 0; maxValue--) {

    }

    // 图像中只有一个颜色
    if(maxValue === minValue) {
        return maxValue;
    }

    // 图像中只有二个颜色
    if(minValue + 1 == maxValue) {
        return minValue;
    }

    threshold = minValue;
    newThreshold = (maxValue + minValue) >> 1;

    // 当前后两次迭代的获得阈值相同时，结束迭代
    while(threshold != newThreshold) {
        let sumOne = 0;
        let sumIntegralOne = 0;
        let sumTwo = 0;
        let sumIntegralTwo = 0;

        threshold = newThreshold;
        //根据阈值将图像分割成目标和背景两部分，求出两部分的平均灰度值
        for(let x = minValue; x <= threshold; x++) {
            sumIntegralOne += histogram[x] * x;
            sumOne += histogram[x];
        }

        let meanValueOne = sumIntegralOne / sumOne;
        for(X = threshold + 1; X <= maxValue; X++) {
            sumIntegralTwo += histogram[X] * X;
            sumTwo += histogram[X];
        }

        let meanValueTwo = sumIntegralTwo / sumTwo;
        //求出新的阈值
        newThreshold = (meanValueOne + meanValueTwo) >> 1;
        iter++;

        if(iter >= 1000) {
            return -1;
        }
    }

    return threshold;
}
```

## 论文

无

## References

- [1] 十三种基于直方图的图像全局二值化算法原理、实现、代码及效果 : https://cloud.tencent.com/developer/article/1011809

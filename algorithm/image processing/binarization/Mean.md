# 灰度平局值值法

使用整幅图像的灰度平均值作为二值化的阈值，一般该方法可作为其他方法的初始猜想值。

## 公式

$$
Sum = \sum_{g=0}^{255} g \times h(g)
\\
Amount = \sum_{g=0}^{255} h(g)
\\
Threshold = Sum / Amount
$$

## 实现

- JavaScript 实现

```js
function mean(histogram) {
    let sum = 0;
    let amount = 0;

    // histogram.length 基本为 256
    for (let i = 0; i < histogram.length; i++) {
        amount +=  histogram[i];
        sum += i * histogram[i];
    }

    return sum / amount;
}
```

## 论文

无

## References

- [1] 十三种基于直方图的图像全局二值化算法原理、实现、代码及效果 : https://cloud.tencent.com/developer/article/1011809

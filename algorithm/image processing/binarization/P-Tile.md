# 百分比阈值（ P-Tile ）

最古老的一种阈值选取方法。该方法根据先验概率来设定阈值，使得二值化后的目标或背景像素比例等于先验概率，该方法简单高效，但是对于先验概率难于估计的图像却无能为力。

## 公式

无

## 实现

- JavaScript 实现

```js
/**
 * 
 *  @params tile 背景在图像中所占的面积百分比
 *
 * */
function mean(histogram, tile ) {
    let sum = 0;
    let amount = 0;

    // histogram.length 基本为 256
    for (let i = 0; i < histogram.length; i++) {
        amount +=  histogram[i];
    }

    for (let i = 0 i < histogram.length; i++) {
        sum = sum + histogram[i];
        if (sum >= amount * tile / 100) {
            return i;
        }
    }

    return -1;
}
```

## 论文

无

## References

- [1] 十三种基于直方图的图像全局二值化算法原理、实现、代码及效果 : https://cloud.tencent.com/developer/article/1011809

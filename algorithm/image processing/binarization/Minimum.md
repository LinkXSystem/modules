# 基于谷底最小值的阈值

此方法实用于具有明显双峰直方图的图像，其寻找双峰的谷底作为阈值，但是该方法不一定能获得阈值，对于那些具有平坦的直方图或单峰图像，该方法不合适。

## 实现

- JavaScript 实现

```js
// 检测直方图是否为双峰的
function isBimodal(histogram) {
    let count = 0;
    for(let i = 1; i < 255; i++) {
        if(histogram[i - 1] < histogram[i] && histogram[i + 1] < histogram[i]) {
            count++;
            if(count > 0) return false;
        }
    }

    return count === 2;
}

function minimum(histogram) {
    let iter = 0;

    let _temp = new Array(256);
    let _core = new Array(256);

    for(let i = 0; i < 256; i++) {
        _temp = histogram(i);
        _core = histogram(i);
    }

    while(isBimodal(_core) === false) {
        _core[0] = (_temp[0] + _temp[0] + _temp[1]) / 3;

        for(let i = 1; i < 255; i++) {
            _core[i] = (_temp[i - 1] + _temp[i] + _temp[i + 1]) / 3;
        }

        _core[255] = (_temp[254] + _temp[255] + _temp[255]) / 3;

        _temp = _core.map(item => item);

        iter++;
        if(iter >= 1000) {
            return -1;
        }
    }

    let PeekFound = false;
    for(let i = 1; i < 255; i++) {
        if(_core[i - 1] < _core[i] && _core[i + 1] < _core[i]) {
            PeekFound = true;
        }

        if(PeekFound === true && _core[i - 1] >= _core[i] && _core[i + 1] >= _core[i]) {
            return i - 1;
        }
    }

    return -1;
}
```

## 论文

- J. M. S. Prewitt and M. L. Mendelsohn, "The analysis of cell images," innnals of the New York Academy of Sciences, vol. 128, pp. 1035-1053, 1966.

- C. A. Glasbey, "An analysis of histogram-based thresholding algorithms," CVGIP: Graphical Models and Image Processing, vol. 55, pp. 532-537, 1993.

## References

- [1] 十三种基于直方图的图像全局二值化算法原理、实现、代码及效果 : https://cloud.tencent.com/developer/article/1011809

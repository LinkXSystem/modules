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
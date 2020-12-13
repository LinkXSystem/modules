function random(n) {
    return math_floor(math_random() * n);
}
function random_in_range(low, high) {
    const range = high - low;
    return low + random(range);
}

random_in_range(80000, 81000);

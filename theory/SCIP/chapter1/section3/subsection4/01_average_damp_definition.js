function average(x, y) {
    return (x + y) / 2;
}
function square(x) {
    return x * x;
}
function average_damp(f) {
    return x => average(x, f(x));
}

average_damp(square)(10);

// expected: 55

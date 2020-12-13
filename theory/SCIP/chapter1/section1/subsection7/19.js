function abs(x) {
    return x >= 0 ? x : -x;
}
function average(x, y) {
    return (x + y) / 2;
}
function sqrt(x) {
    return sqrt_iter(1, x);
}
function improve(guess, x) {
    return average(guess, x / guess);
}
function sqrt_iter(guess, x) {
    return good_enough(guess, x)
           ? guess
           : sqrt_iter(improve(guess, x), x);
}
const error_threshold = 0.01;
function good_enough(guess, x) {
    return relative_error(guess, improve(guess, x))
           < error_threshold;
}
function relative_error(estimate, reference) {
    return abs(estimate - reference) / reference;
}

sqrt(3);

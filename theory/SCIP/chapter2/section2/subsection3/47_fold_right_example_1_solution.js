// same as accumulate
const fold_right = accumulate;
function divide(x, y) {
    return x / y;
}
fold_right(divide, 1, list(1, 2, 3));
// result: 1.5

// expected: 1.5

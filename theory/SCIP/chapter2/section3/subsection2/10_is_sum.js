function make_sum(a1, a2) {
    return list("+", a1, a2);
}
function is_sum(x) {
    return is_pair(x) && head(x) === "+";
}

is_sum(make_sum("x", 3));

// expected: true

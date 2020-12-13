function make_sum(a1, a2) {
    return list("+", a1, a2);
}
function augend(s) {
    return head(tail(tail(s)));
}

augend(make_sum("x", 3));

// expected: 3

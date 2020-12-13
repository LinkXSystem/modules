function reverse(xs) {
    let result = null;
    for (let current = xs; ! is_null(current); current = tail(current)) {
        result = pair(head(current), result);
    }
    return result;
}

reverse(list(1, 2, 3));

// expected: [ 3, [ 2, [ 1, null ] ] ]

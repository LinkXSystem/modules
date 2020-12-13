function reverse_functions(xs) {
    let result = null;
    for (let curr = xs; ! is_null(curr); curr = tail(curr)) {
        result = pair(() => head(curr), result);
    }
    return result;
}

function enumerate_tree(tree) {
    return is_null(tree)
           ? null
           : ! is_pair(tree)
           ? list(tree)
           : append(enumerate_tree(head(tree)),
                    enumerate_tree(tail(tree)));
}

tail(tail(enumerate_tree(list(1, list(2, list(3, 4)), 5))));

// expected: [ 3, [ 4, [ 5, null ] ] ]

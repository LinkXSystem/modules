function is_truthy(x) {
    return is_boolean(x) 
           ? x
           : error(x, "boolean expected, received:");
}

is_truthy(false); // should return false because only true is truthy

// expected: false

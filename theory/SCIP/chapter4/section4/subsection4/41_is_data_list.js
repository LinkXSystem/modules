function is_data_list(x) {
    return is_null(x) ||
           (is_pair(x) && ! is_var(x) && is_data_list(tail(x)));
}

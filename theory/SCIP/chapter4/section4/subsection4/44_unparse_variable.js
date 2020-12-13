function unparse_variable(variable) {
    return is_number(head(tail(variable)))
           ? head(tail(tail(variable))) + "_" + stringify(head(tail(variable)))
           : head(tail(variable));
}

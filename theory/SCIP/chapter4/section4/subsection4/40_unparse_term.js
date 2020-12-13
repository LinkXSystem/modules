function is_data_list(x) {
    return is_null(x) ||
           (is_pair(x) && ! is_var(x) && is_data_list(tail(x)));
}
function unparse_term(arg) {
    return is_var(arg)
           ? unparse_variable(arg)
           : is_operator_combination(arg)
           ? "(" + unparse_term(operator_combination_first_operand(arg)) +
             " " + operator_combination_operator_symbol(arg) +
             " " + unparse_term(operator_combination_second_operand(arg)) +
             ")"
           : is_data_list(arg)
           ? unparse("list", arg, unparse_term)
           : is_pair(arg) 
           ? unparse("pair", list(head(arg), tail(arg)), unparse_term)
           : stringify(arg); // literals
}

const my_function_declaration = parse("function f(x) { return x; }");
const my_lambda = list_ref(my_function_declaration, 2);
const my_return = list_ref(my_lambda, 2);
is_return_statement(my_return);
return_expression(my_return);

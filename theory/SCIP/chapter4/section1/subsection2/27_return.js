function is_tagged_list(component, the_tag) {
    return is_pair(component) && head(component) === the_tag;
}
function is_return_statement(component) {
   return is_tagged_list(component, "return_statement");
}
function return_expression(component) {
   return head(tail(component));
}

const my_function_declaration = parse("function f(x) { return x; }");
const my_lambda = list_ref(my_function_declaration, 2);
const my_return = list_ref(my_lambda, 2);
is_return_statement(my_return);
return_expression(my_return);

// expected: [ 'name', [ 'x', null ] ]

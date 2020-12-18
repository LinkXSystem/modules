// functions from SICP JS 4.1.4
function is_truthy(x) {
    return is_boolean(x) 
           ? x
           : error(x, "boolean expected, received:");
}
function is_tagged_list(component, the_tag) {
    return is_pair(component) && head(component) === the_tag;
}
function is_primitive_function(fun) {
   return is_tagged_list(fun, "primitive");
}
function primitive_implementation(fun) {
   return head(tail(fun));
}
const primitive_functions = list(
       list("head",    head             ),
       list("tail",    tail             ),
       list("pair",    pair             ),
       list("list",    list             ),
       list("is_null", is_null          ),
       list("display", display          ),
       list("error",   error            ),
       list("math_abs",math_abs         ),
       list("+",       (x, y) => x + y  ),
       list("-",       (x, y) => x - y  ),
       list("-unary",   x     =>   - x  ),
       list("*",       (x, y) => x * y  ),
       list("/",       (x, y) => x / y  ),
       list("%",       (x, y) => x % y  ),
       list("===",     (x, y) => x === y),
       list("!==",     (x, y) => x !== y),
       list("<",       (x, y) => x <   y),
       list("<=",      (x, y) => x <=  y),
       list(">",       (x, y) => x >   y),
       list(">=",      (x, y) => x >=  y),
       list("!",        x     =>   !   x)
       );
const primitive_function_symbols =
        map(head, primitive_functions);
const primitive_function_objects =
        map(fun => list("primitive", head(tail(fun))),
            primitive_functions);
const primitive_constants = list(list("undefined", undefined),
                                 list("Infinity",  Infinity),
                                 list("math_PI",   math_PI),
                                 list("math_E",    math_E),
                                 list("NaN",       NaN)
                                );
const primitive_constant_symbols =
        map(c => head(c), primitive_constants);
const primitive_constant_values =
        map(c => head(tail(c)), primitive_constants);
function apply_primitive_function(fun, arglist) {
    return apply_in_underlying_javascript(
                primitive_implementation(fun),
                arglist);     
}
function extend_environment(symbols, vals, base_env) {
    return length(symbols) === length(vals)
           ? pair(make_frame(symbols, vals), base_env)
           : length(symbols) < length(vals)
           ? error("Too many arguments supplied: " + 
                   stringify(symbols) + ", " + 
                   stringify(vals))
           : error("Too few arguments supplied: " + 
                   stringify(symbols) + ", " + 
                   stringify(vals));
}
function enclosing_environment(env) {
    return tail(env);
}
function first_frame(env) {
    return head(env);
}
const the_empty_environment = null;
function make_frame(symbols, values) {
    return pair(symbols, values);
}
function frame_symbols(frame) {    
    return head(frame);
}
function frame_values(frame) {    
    return tail(frame);
}
function setup_environment() {
    return extend_environment(
               append(primitive_function_symbols, 
                      primitive_constant_symbols),
               append(primitive_function_objects, 
                      primitive_constant_values),
               the_empty_environment);
}
let the_global_environment = setup_environment();

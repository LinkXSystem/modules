// functions from SICP JS 4.1.1
function list_of_unassigned(symbols) {
    return map(symbol => "*unassigned*", symbols);
}
// functions from SICP JS 4.1.2
function is_literal(component) {
    return is_tagged_list(component, "literal");
}
function literal_value(component) {    
    return head(tail(component));
}
function is_tagged_list(component, the_tag) {
    return is_pair(component) && head(component) === the_tag;
}
function is_name(component) {
    return is_tagged_list(component, "name");
}
function make_name(symbol) {
    return list("name", symbol);
}
function symbol_of_name(component) {
    return head(tail(component));
}
function is_assignment(component) {
    return is_tagged_list(component, "assignment");
}
function assignment_symbol(component) {
    return head(tail(head(tail(component))));
}
function assignment_value_expression(component) {
    return head(tail(tail(component)));
}
function is_declaration(component) {
    return is_tagged_list(component, "constant_declaration") ||
           is_tagged_list(component, "variable_declaration") ||
           is_tagged_list(component, "function_declaration");
}
function declaration_symbol(component) {
   return symbol_of_name(head(tail(component)));
}
function declaration_value_expression(component) {
   return head(tail(tail(component)));
}
function make_constant_declaration(name, value_expression) {
    return list("constant_declaration", name, value_expression);
}
function is_lambda_expression(component) {
   return is_tagged_list(component, "lambda_expression");
}
function lambda_parameter_symbols(component) {
   return map(symbol_of_name, head(tail(component)));
}
function lambda_body(component) {
   return head(tail(tail(component)));
}
function make_lambda_expression(parameters, body) {
    return list("lambda_expression", parameters, body);
}
function is_function_declaration(component) {	    
    return is_tagged_list(component, "function_declaration");
}
function function_declaration_name(component) {
    return list_ref(component, 1);
}
function function_declaration_parameters(component) {
    return list_ref(component, 2);
}
function function_declaration_body(component) {
    return list_ref(component, 3);
}
function function_decl_to_constant_decl(component) {
    return make_constant_declaration(
               function_declaration_name(component),
               make_lambda_expression(
                   function_declaration_parameters(component),
                   function_declaration_body(component)));
}
function is_return_statement(component) {
   return is_tagged_list(component, "return_statement");
}
function return_expression(component) {
   return head(tail(component));
}
function is_conditional(component) {
    return is_tagged_list(component, "conditional_expression") ||
           is_tagged_list(component, "conditional_statement");
}
function conditional_predicate(component) {
   return list_ref(component, 1);
}
function conditional_consequent(component) {
   return list_ref(component, 2);
}
function conditional_alternative(component) {
   return list_ref(component, 3);
}
function is_sequence(stmt) {
   return is_tagged_list(stmt, "sequence");
}
function sequence_statements(stmt) {   
   return head(tail(stmt));
}
function first_statement(stmts) {
   return head(stmts);
}
function rest_statements(stmts) {
   return tail(stmts);
}
function is_empty_sequence(stmts) {
   return is_null(stmts);
}
function is_last_statement(stmts) {
   return is_null(tail(stmts));
}
function is_block(component) {
    return is_tagged_list(component, "block");
}
function block_body(component) {
    return head(tail(component));
}
function make_block(statement) {
    return list("block", statement);
}
function is_operator_combination(component) {	    
    return is_tagged_list(component, "operator_combination");
}
function operator_combination_operator_symbol(component) {
    return list_ref(component, 1);
}
function operator_combination_first_operand(component) {
    return list_ref(component, 2);
}
function operator_combination_second_operand(component) {
    return list_ref(component, 3);
}
function make_application(function_expression, argument_expressions) {
    return list("application", function_expression, argument_expressions);
}
function operator_combination_to_application(component) {
    const operator = operator_combination_operator_symbol(component);
    return operator === "!" || operator === "-unary"
           ? make_application(
                 make_name(operator),
                 list(operator_combination_first_operand(component)))
           : make_application(
                 make_name(operator),
                 list(operator_combination_first_operand(component),
                      operator_combination_second_operand(component)));
}
function is_application(component) {
   return is_tagged_list(component, "application");
}
function function_expression(component) {
   return head(tail(component));
}
function arg_expressions(component) {
   return head(tail(tail(component)));
}

// functions from SICP JS 4.1.3
function is_truthy(x) {
    return is_boolean(x) 
           ? x
           : error(x, "boolean expected, received:");
}
function make_function(parameters, body, env) {
    return list("compound_function",
                parameters, body, env);
}
function is_compound_function(f) {
    return is_tagged_list(f, "compound_function");
}
function function_parameters(f) {
    return list_ref(f, 1);
}
function function_body(f) {
    return list_ref(f, 2);
}
function function_environment(f) {
    return list_ref(f, 3);
}
function make_return_value(content) {
    return list("return_value", content);
}
function is_return_value(value) {
    return is_tagged_list(value, "return_value");
}
function return_value_content(value) {
    return head(tail(value));
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
function lookup_symbol_value(symbol, env) {
    function env_loop(env) {
        function scan(symbols, vals) {
            return is_null(symbols)
                   ? env_loop(enclosing_environment(env))
                   : symbol === head(symbols)
                   ? head(vals)
                   : scan(tail(symbols), tail(vals));
        }
        if (env === the_empty_environment) {
            error(symbol, "Unbound name");
        } else {
            const frame = first_frame(env);
            return scan(frame_symbols(frame),
                        frame_values(frame));
        }
    }
    return env_loop(env);
}
function assign_symbol_value(symbol, val, env) {
    function env_loop(env) {
        function scan(symbols, vals) {
            return is_null(symbols)
                   ? env_loop(enclosing_environment(env))
                   : symbol === head(symbols)
                   ? set_head(vals, val)
                   : scan(tail(symbols), tail(vals));
        } 
        if (env === the_empty_environment) {
            error(symbol, "Unbound name -- assignment");
        } else {
            const frame = first_frame(env);
            return scan(frame_symbols(frame),
                        frame_values(frame));
        }
    }
    return env_loop(env);
}

// functions from SICP JS 4.1.4
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
function setup_environment() {
    return extend_environment(
               append(primitive_function_symbols, 
                      primitive_constant_symbols),
               append(primitive_function_objects, 
                      primitive_constant_values),
               the_empty_environment);
}
let the_global_environment = setup_environment();

// functions from SICP JS 4.1.7
function analyze_literal(component) {      
    return env => literal_value(component);
}
function analyze_name(component) {      
    return env => lookup_symbol_value(
                      symbol_of_name(component), env);
}
function analyze_assignment(component) {
    const symbol = assignment_symbol(component);
    const vfun = analyze(assignment_value_expression(component));
    return env => {
               const value = vfun(env);
               assign_symbol_value(symbol, value, env);
               return value;
           };
}

function analyze_declaration(component) {
    const symbol = declaration_symbol(component);
    const vfun = analyze(declaration_value_expression(component));
    return env => {
               assign_symbol_value(symbol, vfun(env), env);
               return undefined;
           };
}
function analyze_conditional(component) {	
    const pfun = analyze(conditional_predicate(component));
    const cfun = analyze(conditional_consequent(component));
    const afun = analyze(conditional_alternative(component));
    return env => is_truthy(pfun(env)) ? cfun(env) : afun(env);
}
function scan_out_declarations(component) {
    return is_sequence(component)
           ? accumulate(
                 append,
                 null,
                 map(scan_out_declarations,
                     sequence_statements(component)))
           : is_declaration(component)
           ? list(declaration_symbol(component))
           : null;
}
function analyze_lambda_expression(component) {
    const params = lambda_parameter_symbols(component);
    const bfun = analyze(lambda_body(component));
    return env => make_function(params, bfun, env);
}
function analyze_sequence(stmts) {
    function sequentially(fun1, fun2) {
        return env => {
            const fun1_val = fun1(env);
            return is_return_value(fun1_val)
                   ? fun1_val
                   : fun2(env);
        };
    }
    function loop(first_fun, rest_funs) {
        return is_null(rest_funs)
               ? first_fun
               : loop(sequentially(first_fun,
                          head(rest_funs)),
                      tail(rest_funs));
    }
    const funs = map(analyze, stmts);
    return is_null(funs) 
           ? env => undefined
           : loop(head(funs), tail(funs));
}
function analyze_block(component) {
    const body = block_body(component);
    const bfun = analyze(body);
    const locals = scan_out_declarations(body);	    
    const unassigneds = list_of_unassigned(locals);
    return env => bfun(extend_environment(locals, unassigneds, env));
}
function analyze_return_statement(component) {
    const rfun = analyze(return_expression(component));
    return env => make_return_value(rfun(env));
}
function analyze_application(component) {	
    const ffun = analyze(function_expression(component));
    const afuns = map(analyze, arg_expressions(component));
    return env =>
           execute_application(ffun(env),
               map(afun => afun(env), afuns));
}

function execute_application(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function(fun)) {
        const parameters = function_parameters(fun);
        const body = function_body(fun);
        const result = body(extend_environment(parameters, args,
	                       function_environment(fun)));
        return is_return_value(result)
               ? return_value_content(result)
               : undefined;
    } else {
        error(fun, "unknown function type -- execute_application");
    }
}
function analyze(component) {
    return is_literal(component)
        ? analyze_literal(component)
        : is_name(component)
        ? analyze_name(component)
        : is_application(component)
        ? analyze_application(component)
	: is_operator_combination(component)
        ? analyze(operator_combination_to_application(component))
        : is_conditional(component)
        ? analyze_conditional(component)
        : is_lambda_expression(component)
        ? analyze_lambda_expression(component)
        : is_sequence(component)
        ? analyze_sequence(sequence_statements(component))
        : is_block(component)
        ? analyze_block(component)
        : is_return_statement(component)
        ? analyze_return_statement(component)
        : is_function_declaration(component)	    
        ? analyze(function_decl_to_constant_decl(component))
        : is_declaration(component)
        ? analyze_declaration(component)
        : is_assignment(component)
        ? analyze_assignment(component)
        : error(component, "Unknown syntax -- analyze");
}
function evaluate(component, env) {      
    return analyze(component)(env);
}
function parse_and_evaluate(input) {
    const program = parse(input);
    const locals = scan_out_declarations(program);
    const unassigneds = list_of_unassigned(locals);
    const program_env = extend_environment(locals, unassigneds,
                                       the_global_environment);
    return evaluate(program, program_env);
}
parse_and_evaluate("                              \
function map(f, xs) {                             \
    return is_null(xs)                            \
           ? null                                 \
           : pair(f(head(xs)), map(f, tail(xs))); \
}                                                 \
tail(map(x => x + 1, list(1, 2, 3, 4)));          ");

// expected: [ 3, [ 4, [ 5, null ] ] ]

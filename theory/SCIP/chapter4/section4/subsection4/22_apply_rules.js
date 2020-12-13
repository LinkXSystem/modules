function stream_append_delayed(s1, delayed_s2) {
    return is_null(s1)
           ? delayed_s2()
           : pair(head(s1),
                  () => stream_append_delayed(stream_tail(s1),
                                              delayed_s2));
}
function interleave_delayed(s1, delayed_s2) {
    return is_null(s1)
           ? delayed_s2()
           : pair(head(s1),
                  () => interleave_delayed(
                            delayed_s2(),
                            () => stream_tail(s1)));
}
function stream_flatmap(fun, s) {
    return flatten_stream(stream_map(fun, s));
}
function flatten_stream(stream) {
    return is_null(stream)
           ? null
           : interleave_delayed(
                 head(stream),
                 () => flatten_stream(stream_tail(stream)));
}
let rule_counter = 0;

function new_rule_application_id() {
    rule_counter = rule_counter + 1;
    return rule_counter;
}
function make_new_variable(variable, rule_application_id) {
    return pair("?", pair(rule_application_id, tail(variable)));
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

function is_var(exp) {
    return is_tagged_list(exp, "?");
}
function rename_variables_in(rule) {
    const rule_application_id = new_rule_application_id();
    function tree_walk(exp) {
        return is_var(exp) 
               ? make_new_variable(exp, rule_application_id)
               : is_pair(exp)
               ? pair(tree_walk(head(exp)),
                      tree_walk(tail(exp)))
               : exp;
    }
    return tree_walk(rule);
}
// operation_table, put and get
// from chapter 3 (section 3.3.3)
function assoc(key, records) {
    return is_null(records)
           ? undefined
           : equal(key, head(head(records)))
           ? head(records)
           : assoc(key, tail(records));
}
function make_table() {
    const local_table = list("*table*");
    function lookup(key_1, key_2) {
        const subtable = assoc(key_1, tail(local_table));
        if (is_undefined(subtable)) {
            return undefined;
        } else {
            const record = assoc(key_2, tail(subtable));
            return is_undefined(record)
                   ? undefined
                   : tail(record);
        }
    }
    function insert(key_1, key_2, value) {
        const subtable = assoc(key_1, tail(local_table));
        if (is_undefined(subtable)) {
            set_tail(local_table,
                     pair(list(key_1, pair(key_2, value)),
                          tail(local_table)));
        } else {
            const record = assoc(key_2, tail(subtable));
            if (is_undefined(record)) {
      	        set_tail(subtable,
	                       pair(pair(key_2, value),
                              tail(subtable)));
	    } else {
                set_tail(record, value);
            }
        }
    }
    function dispatch(m) {
        return m === "lookup"
               ? lookup
               : m === "insert"
               ? insert
               : error(m, "Unknown operation -- table");
    }
    return dispatch;
}
const operation_table = make_table();
const get = operation_table("lookup");
const put = operation_table("insert");
function make_binding(variable, value) {
    return pair(variable, value);
}
function binding_variable(binding) {
    return head(binding);
}
function binding_value(binding) {
    return tail(binding);
}
function binding_in_frame(variable, frame) {
    return assoc(variable, frame);
}
function extend(variable, value, frame) {
    return pair(make_binding(variable, value), frame);
}
function depends_on(expression, variable, frame) {
    function tree_walk(e) {
        if (is_var(e)) {
            if (equal(variable, e)) {
                return true;
            } else {
                const b = binding_in_frame(e, frame);
                return is_undefined(b)
                       ? false
                       : tree_walk(binding_value(b));
            }
	} else {
            return is_pair(e) 
                   ? tree_walk(head(e)) || tree_walk(tail(e))
                   : false;
        }
    }
    return tree_walk(expression);
}
function extend_if_possible(variable, value, frame) {
    const binding = binding_in_frame(variable, frame);
    if (! is_undefined(binding)) {
        return unify_match(binding_value(binding), 
                            value, frame); 
    } else if (is_var(value)) {                      // ***
        const binding = binding_in_frame(value, frame);
        return ! is_undefined(binding)
               ? unify_match(variable,
                             binding_value(binding),
                             frame)
               : extend(variable, value, frame);
    } else if (depends_on(value, variable, frame)) { // ***
        return "failed";
    } else {
        return extend(variable, value, frame);
    }
}
function unify_match(p1, p2, frame) {
    return frame === "failed"
           ? "failed"
           : equal(p1, p2)
           ? frame
           : is_var(p1) 
           ? extend_if_possible(p1, p2, frame)
           : is_var(p2) 
           ? extend_if_possible(p2, p1, frame)  // ***
           : is_pair(p1) && is_pair(p2)
           ? unify_match(tail(p1),
                         tail(p2),
                         unify_match(head(p1),
                                     head(p2),
                                     frame))
           : "failed";
}
function singleton_stream(x) {
    return pair(x, () => null);
}
function is_rule(assertion) {
    return is_tagged_list(assertion, "rule");
}
function conclusion(rule) {
    return head(tail(rule));
}
function rule_body(rule) {
    return is_null(tail(tail(rule)))
           ? list("always_true")
           : head(tail(tail(rule)));
}
function apply_a_rule(rule, query_pattern, query_frame) {
    const clean_rule = rename_variables_in(rule);
    const unify_result = 
             unify_match(query_pattern,
                         conclusion(clean_rule),
                         query_frame);
    return unify_result === "failed"
           ? null
           : evaluate_query(rule_body(clean_rule),
                            singleton_stream(unify_result));
}
function get_stream(key1, key2) {
    const s = get(key1, key2);
    return is_undefined(s) ? null : s;
}
function index_key_of(pat) {
    return(head(pat));
}
function fetch_rules(pattern, frame) {
    return get_indexed_rules(pattern);
}
function get_indexed_rules(pattern) {
    return get_stream(index_key_of(pattern), "rule-stream");
}
// functions from SICP JS 4.1.1
function evaluate(component, env) {
   return is_literal(component)
          ? literal_value(component)
          : is_name(component)
          ? lookup_symbol_value(symbol_of_name(component), env)
          : is_application(component)
          ? apply(evaluate(function_expression(component), env),
                  list_of_values(arg_expressions(component), env))
          : is_operator_combination(component)
          ? evaluate(operator_combination_to_application(component), env)
          : is_conditional(component)
          ? eval_conditional(component, env)
          : is_lambda_expression(component)
          ? make_function(lambda_parameter_symbols(component),
                          lambda_body(component), env)
          : is_sequence(component)
          ? eval_sequence(sequence_statements(component), env)
          : is_block(component)
          ? eval_block(component, env)
          : is_return_statement(component)
          ? eval_return_statement(component, env)
          : is_function_declaration(component)	    
          ? evaluate(function_decl_to_constant_decl(component), env)
          : is_declaration(component)
          ? eval_declaration(component, env)
          : is_assignment(component)
          ? eval_assignment(component, env)
          : error(component, "Unknown syntax -- evaluate");
}
function apply(fun, args) {
   if (is_primitive_function(fun)) {
      return apply_primitive_function(fun, args);
   } else if (is_compound_function(fun)) {
      const result = evaluate(function_body(fun),
                              extend_environment(
                                  function_parameters(fun),
                                  args,
                                  function_environment(fun)));
      return is_return_value(result)
             ? return_value_content(result)
             : undefined;
   } else {
      error(fun, "Unknown function type -- apply");
   }
}
function list_of_values(exps, env) {
     return map(arg => evaluate(arg, env), exps);
}
function eval_conditional(component, env) {
    return is_truthy(evaluate(conditional_predicate(component), env))
           ? evaluate(conditional_consequent(component), env)
           : evaluate(conditional_alternative(component), env);
}
function eval_sequence(stmts, env) {
    if (is_empty_sequence(stmts)) {
        return undefined;
    } else if (is_last_statement(stmts)) {
        return evaluate(first_statement(stmts),env);
    } else {
        const first_stmt_value = 
            evaluate(first_statement(stmts),env);
        if (is_return_value(first_stmt_value)) {
            return first_stmt_value;
        } else {
            return eval_sequence(
                rest_statements(stmts),env);
        }
    }
}
function list_of_unassigned(symbols) {
    return map(symbol => "*unassigned*", symbols);
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
function eval_block(component, env) {
    const body = block_body(component);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigned(locals);
    return evaluate(body, extend_environment(locals,
                                             unassigneds, 
                                             env));
}
function eval_return_statement(component, env) {
    return make_return_value(
               evaluate(return_expression(component), env));
}
function eval_assignment(component, env) {
    const value = evaluate(assignment_value_expression(component), env);
    assign_symbol_value(assignment_symbol(component), value, env);
    return value;
}
function eval_declaration(component, env) {
    assign_symbol_value(declaration_symbol(component), 
                        evaluate(declaration_value_expression(component),
                                 env),
                        env);
    return undefined;
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

// functions from SICP JS 4.4.4
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
function unparse_variable(variable) {
    return is_number(head(tail(variable)))
           ? head(tail(tail(variable))) + "_" + stringify(head(tail(variable)))
           : head(tail(variable));
}
function unparse_query(query) {
    return is_null(member(head(query), list("and", "or", "not")))
           ? unparse(head(query), tail(query), unparse_term)
           : unparse(head(query), tail(query), unparse_query);
}
function unparse(expression_head, args, arg_unparse) {	
    return expression_head + "(" + comma_separated(map(arg_unparse, args)) + ")";
}
function comma_separated(strings) {
    return accumulate((s, acc) => s + (acc === "" ? "" : ", " + acc),
                      "", strings);
}
function javascript_value_process(exp) {
    return is_operator_combination(exp)
           ? list("operator_combination", 
                  operator_combination_operator_symbol(exp),
                  javascript_value_process(
                      operator_combination_first_operand(exp)),
                  javascript_value_process(
                      operator_combination_second_operand(exp)))
           : is_name(exp)
           ? list("?", symbol_of_name(exp))
           : exp;
}
function parse_query(input) {
    const exp = parse(input + ";");
    return query_syntax_process(exp);
}
function query_syntax_process(exp) {
    if (is_application(exp)) {
      const function_symbol = symbol_of_name(function_expression(exp));
      if (function_symbol === "javascript_value") {
          return pair(function_symbol,
                      map(javascript_value_process, arg_expressions(exp)));      
      } else {
          const processed_args = map(query_syntax_process, arg_expressions(exp));
          return function_symbol === "pair"
                 ? pair(head(processed_args), head(tail(processed_args)))
                 : function_symbol === "list"
                 ? processed_args
                 : pair(function_symbol, processed_args);
      }
    } else if (is_name(exp)) {
      return list("?", symbol_of_name(exp));
    } else if (is_literal(exp)) {
      return literal_value(exp);
    } else {
      error(exp, "unknown query syntax -- query_syntax_process");
    }
}
function type(exp) {
    return is_pair(exp)
           ? head(exp)
           : error(exp, "Unknown expression type");
}
function contents(exp) {
    return is_pair(exp)
           ? tail(exp)
           : error(exp, "Unknown expression contents");
}
function is_assertion(exp) {
    return type(exp) === "assert";
}
function assertion_body(exp) {
    return head(contents(exp));
}
function instantiate(exp, frame, unbound_var_handler) {
    function copy(exp) {
        if (is_var(exp)) {
            const binding = binding_in_frame(exp, frame);
            return is_undefined(binding)
                   ? unbound_var_handler(exp, frame)
                   : copy(binding_value(binding));
        } else if (is_pair(exp)) {
            return pair(copy(head(exp)), copy(tail(exp)));
        } else {
            return exp;
        }
    }
    return copy(exp);
}
function extend_if_consistent(variable, data, frame) {
    const binding = binding_in_frame(variable, frame);
    return is_undefined(binding)
           ? extend(variable, data, frame)
           : pattern_match(binding_value(binding), data, frame);
}
function pattern_match(pat, dat, frame) {
    return frame === "failed" 
           ? "failed"
           : equal(pat, dat) 
           ? frame   
           : is_var(pat) 
           ? extend_if_consistent(pat, dat, frame)
           : is_pair(pat) && is_pair(dat)
           ? pattern_match(tail(pat),
                           tail(dat),
                           pattern_match(head(pat),
                                         head(dat),
                                         frame))
           : "failed";
}
function check_an_assertion(assertion, query_pat, query_frame) {
    const match_result = pattern_match(query_pat, assertion, 
                                       query_frame);
    return match_result === "failed"
           ? null
           : singleton_stream(match_result);
}
function fetch_assertions(pattern, frame) {
    return get_indexed_assertions(pattern);
}
function get_indexed_assertions(pattern) {
    return get_stream(index_key_of(pattern), "assertion-stream");
}
function find_assertions(pattern, frame) {
    return stream_flatmap(
              datum =>
                 check_an_assertion(datum, pattern, frame),
              fetch_assertions(pattern, frame));
}
function simple_query(query_pattern, frame_stream) {
    return stream_flatmap(
               frame => 
                   stream_append_delayed(
                       find_assertions(query_pattern, frame),
                       () => apply_rules(query_pattern, frame)),
               frame_stream);
}
function evaluate_query(query, frame_stream) {
    const qfun = get(type(query), "evaluate_query");
    return is_undefined(qfun)
           ? simple_query(query, frame_stream)
           : qfun(contents(query), frame_stream);
}
function store_assertion_in_index(assertion) {
    const key = index_key_of(assertion);
    const current_assertion_stream =
                get_stream(key, "assertion-stream");
    put(key, "assertion-stream",
        pair(assertion, () => current_assertion_stream));
}
function store_rule_in_index(rule) {
    const pattern = conclusion(rule);
    const key = index_key_of(pattern);
    const current_rule_stream =
                get_stream(key, "rule-stream");
    put(key, "rule-stream",
        pair(rule, () => current_rule_stream));
}
function add_rule_or_assertion(assertion) {
    return is_rule(assertion) 
           ? add_rule(assertion)
           : add_assertion(assertion);
}
function add_assertion(assertion) {
    store_assertion_in_index(assertion);
    return "ok";
}
function add_rule(rule) {
    store_rule_in_index(rule);
    return "ok";
}
function is_empty_conjunction(exps) { return is_null(exps); }
function first_conjunct(exps) { return head(exps); }
function rest_conjuncts(exps) { return tail(exps); }

function is_empty_disjunction(exps) { return is_null(exps); }
function first_disjunct(exps) { return head(exps); }
function rest_disjuncts(exps) { return tail(exps); }

function negated_query(exps) { return head(exps); }

function javascript_expression(exps) { return head(exps); }
function conjoin(conjuncts, frame_stream) {
    return is_empty_conjunction(conjuncts)
           ? frame_stream
           : conjoin(rest_conjuncts(conjuncts),
                     evaluate_query(first_conjunct(conjuncts),
	                            frame_stream));
}
put("and", "evaluate_query", conjoin);
function disjoin(disjuncts, frame_stream) {
    return is_empty_disjunction(disjuncts)
           ? null
           : interleave_delayed(
                 evaluate_query(first_disjunct(disjuncts), frame_stream),
	         () => disjoin(rest_disjuncts(disjuncts), frame_stream));
}
put("or", "evaluate_query", disjoin);
function negate(args, frame_stream) {
    return stream_flatmap(
              frame =>
	         is_null(evaluate_query(negated_query(args),
                                        singleton_stream(frame)))
	         ? singleton_stream(frame)
		 : null,
	      frame_stream);
}
put("not", "evaluate_query", negate);
function execute(exp) {
    return evaluate(exp, the_global_environment);
}
function javascript_value(args, frame_stream) {
  return stream_flatmap(
           frame =>
               execute(instantiate(
                           javascript_expression(args), frame,
                           (v, f) =>
                               error(v, 
                                     "Unknown pat var -- " +
                                     "javascript_value")))
               ? singleton_stream(frame)
               : null,
           frame_stream);
}
put("javascript_value", "evaluate_query", javascript_value);
const max_display = 9;
function display_stream(s) {
    function display_stream_iter(st, n) {
        if (is_null(st)) {
        } else if (n === 0) {
            display('', "...");
        } else {
            display(head(st));
            display_stream_iter(stream_tail(st), n - 1);
        }
    }
    display_stream_iter(s, max_display);
}
function always_true(ignore, frame_stream) {
    return frame_stream;
}
put("always_true", "evaluate_query", always_true);

function parse_query_verbose(input, verbosity) {
    const q = parse_query(input);
    if (verbosity !== "silent") {
        display("--- process query input  ---"); 
        display(unparse_query(q)); } else {}
    if (is_assertion(q)) {
        add_rule_or_assertion(assertion_body(q));
        if (verbosity !== "silent") {
            display("----- assertion added ------"); } else {}
    } else {
        display("------ query results -------");
        display_stream(
            stream_map(
                frame =>
                    unparse_query(
                        instantiate(q, frame, (v, f) => v)),
                evaluate_query(q, singleton_stream(null))));
    }
}
function process_query(input, verbosity) {
    if (is_null(input)) {
        display("--- evaluator terminated ---");
    } else {
        const q = parse_query(input);
        display("---- driver loop input -----");
        display(unparse_query(q));
        if (is_assertion(q)) {
            add_rule_or_assertion(assertion_body(q));
            display("Assertion added to data base.");
        } else {
            display("------ query results -------", "");
            display_stream(
              stream_map(
                frame =>
                  unparse_query(
		    instantiate(q, frame, (v, ignore) => v)),
                evaluate_query(q, singleton_stream(null))));
        }
    }
}
    
function first_answer(input) {
    const q = parse_query(input);
    const frames = evaluate_query(q, singleton_stream(null));
    return is_null(frames)
           ? "no matching data"
           : unparse_query(instantiate(q, head(frames), (v, f) => v));
}
function apply_rules(pattern, frame) {
    return stream_flatmap(
              rule => 
                 apply_a_rule(rule, pattern, frame),
              fetch_rules(pattern, frame));
}

parse_query_verbose('assert(                           \
rule(append_to_form(null, y, y)))                ', "verbose");
parse_query_verbose('assert(                           \
rule(append_to_form(pair(u, v), y, pair(u, z)),  \
     append_to_form(v, y, z)))                   ', "verbose");
	  
first_answer('append_to_form(x, y, list("a", "b", "c", "d"))');
// parse_query_verbose('append_to_form(x, y, list("a", "b", "c", "d"))', "");

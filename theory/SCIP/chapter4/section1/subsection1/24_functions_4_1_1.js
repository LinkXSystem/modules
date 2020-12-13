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


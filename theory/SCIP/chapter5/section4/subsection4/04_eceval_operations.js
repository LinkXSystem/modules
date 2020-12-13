function prompt_for_input(input_prompt) {
    const input = prompt(input_prompt);
    if (is_null(input)) {
        display("--- evaluator terminated ---", "");
        return null;
    } else {
        display("----------------------------",
                input_prompt + "\n" + input + "\n");
        return parse(input);
    }
}
const eceval_operations = 
    list(
      // args
      list("args"                 , arg_expressions),
      list("function_expression"  , function_expression),
      list("has_no_argument_expressions"
                                  , is_null),
      list("first_arg"            , head),
      list("is_last_argument_expression"
                                  , a => is_null(tail(a))),
      list("rest_args"            , tail),

      //arg
      list("empty_arglist"        , () => null),
      list("adjoin_arg"           , (val, argl) => append(argl,
                                                      list(val))),

      // stmt (sequence)
      list("first_statement"     , first_statement),
      list("rest_statements"     , rest_statements),
      list("is_last_statement"   , is_last_statement),
      list("sequence_statements" , sequence_statements),

      // eval functions from meta-circular evaluator
      list("is_literal"  , is_literal),
      list("literal_value"       , literal_value),
      list("is_name"             , is_name),
      list("symbol_of_name"      , symbol_of_name),
      list("is_assignment"       , is_assignment),
      list("assignment_symbol"   , assignment_symbol),
      list("assignment_value_expression"
                                 , assignment_value_expression),
      list("assign_symbol_value" , assign_symbol_value),
      list("is_declaration"      , is_declaration),
      list("declaration_symbol"  , declaration_symbol),
      list("declaration_value_expression"
                                 , declaration_value_expression),
      list("assign_symbol_value" , assign_symbol_value),
      list("is_lambda_expression", is_lambda_expression),
      list("lambda_parameter_symbols"
                                 , lambda_parameter_symbols),
      list("lambda_body"         , lambda_body),
      list("is_return_statement" , is_return_statement),
      list("return_expression"   , return_expression),
      list("is_conditional"
                                 , is_conditional),
      list("conditional_predicate"
				 , conditional_predicate),
      list("conditional_consequent"
                                 , conditional_consequent),
      list("conditional_alternative"
                                 , conditional_alternative),
      list("is_sequence"         , is_sequence),
      list("is_block"            , is_block),
      list("block_body"          , block_body),
      list("scan_out_declarations"
                                 , scan_out_declarations),
      list("does_not_handle_return"
                                 , s => !(is_block(s) ||
                                          is_sequence(s) ||
                                          is_return_statement(s))),
      list("list_of_unassigned"  , list_of_unassigned),
      list("is_application"      , is_application),
      list("is_primitive_function"
                                 , is_primitive_function),
      list("apply_primitive_function"
                                 , apply_primitive_function),
      list("is_compound_function", is_compound_function),
      list("function_parameters" , function_parameters),
      list("function_environment", function_environment),
      list("function_body"       , function_body),
      list("extend_environment"  , extend_environment),
      list("make_function"       , make_function),

      list("lookup_name_value"   , (stmt, env) =>
                                   lookup_symbol_value(
				       symbol_of_name(stmt),
				       env)),

      list("get_program_environment"
                                 , get_program_environment),
      list("set_program_environment"
                                 , set_program_environment),

      // generic helpers
      list("is_truthy", is_truthy),
      list("is_null", is_null),

      list("prompt_for_input", prompt_for_input),
      list("user_print", user_print),
      list("display", display),
      list("list", list)
    );

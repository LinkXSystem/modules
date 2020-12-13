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
function get_program_environment() {
    return the_global_environment;
}
function set_program_environment(env) {
    the_global_environment = env;
}
const eceval_operations = 
    list(
      // args
      list("args"                    , arg_expressions),
      list("function_expression"     , function_expression),
      list("has_no_operands"         , no_args),
      list("first_arg"               , first_arg),
      list("is_last_operand"         , a => is_null(tail(a))),
      list("rest_args"               , rest_args),

      //arg
      list("empty_arglist"           , _ => list()),
      list("adjoin_arg"              , (val, argl) => append(argl, list(val))),

      // exp (sequence)
      list("first_statement"         , first_statement),
      list("rest_statements"         , rest_statements),
      list("is_last_statement"       , is_last_statement),
      list("sequence_statements"     , sequence_statements),

      // eval functions from meta-circular evaluator
      list("is_literal"              , is_literal),
      list("literal_value"           , literal_value),
      list("is_name"                 , is_name),
      list("symbol_of_name"          , symbol_of_name),
      list("all_symbols_of_names"    , names => map(symbol_of_name, names)),
      list("is_assignment"           , is_assignment),
      list("assignment_symbol"       , assignment_symbol),
      list("assignment_value_expression"
                                     , assignment_value_expression),
      list("assign_symbol_value"     , assign_symbol_value),
      list("is_declaration"          , is_declaration),
      list("declaration_symbol"      , declaration_symbol),
      list("declaration_value_expression"
                                     , declaration_value_expression),
      list("assign_symbol_value"     , assign_symbol_value),
      list("is_lambda_expression"    , is_lambda_expression),
      list("lambda_parameter_symbols", lambda_parameter_symbols),
      list("lambda_body"             , lambda_body),
      list("is_return_statement"     , is_return_statement),
      list("return_expression"       , return_expression),
      list("is_conditional"          , is_conditional),
      list("conditional_predicate"   , conditional_predicate),
      list("conditional_consequent"  , conditional_consequent),
      list("conditional_alternative" , conditional_alternative),

      list("is_sequence"             , is_sequence),
      list("is_block"                , is_block),
      list("block_body"              , block_body),
      list("scan_out_declarations"   , scan_out_declarations),
      list("does_not_return"         ,
           s => !(is_block(s) || is_sequence(s) || is_return_statement(s))),
      list("list_of_unassigned"      , list_of_unassigned),
      list("is_application"          , is_application),
      list("is_primitive_function"   , is_primitive_function),
      list("apply_primitive_function", apply_primitive_function),
      list("is_compound_function"    , is_compound_function),
      list("function_parameters"     , function_parameters),
      list("function_environment"    , function_environment),
      list("function_body"           , function_body),
      list("extend_environment"      , extend_environment),
      list("make_function"           , make_function),

      list(
        "lookup_symbol_value"        ,
        (stmt, env) => lookup_symbol_value(symbol_of_name(stmt), env)
      ),
      list("get_program_environment" , get_program_environment),
      list("set_program_environment" , set_program_environment),

      // generic helpers
      list("is_truthy"               , is_truthy),
      list("is_null"                 , is_null),
      list("is_pair"                 , is_pair),
      list("is_number"               , is_number),
      list("append"                  , append),
      list("pair"                    , pair),

      list("prompt_for_input"        , prompt_for_input),
      list("user_print"              , user_print),
      list("display"                 , display),
      list("make_compiled_function"  , make_compiled_function),
      list("is_compiled_function"    , is_compiled_function),
      list("compiled_function_env"   , compiled_function_env),
      list("compiled_function_entry" , compiled_function_entry),
      list("list"                    , list),
      list("is_falsy"                , x => ! is_truthy(x))
    );

const eceval_controller =
list(
      branch(label("external_entry")), // branches if flag is set    

      "read_eval_print_loop",
      perform(list(op("initialize_stack"))),
      assign("stmt", list(op("prompt_for_input"),
                          constant("EC-evaluate input:"))),
      test(list(op("is_null"), reg("stmt"))),
      branch(label("evaluator_done")),
      assign("env", list(op("get_program_environment"))),
      assign("val", list(op("scan_out_declarations"), reg("stmt"))),
      save("stmt"), // temporarily store to stmt
      assign("stmt", list(op("list_of_unassigned"), reg("val"))),
      assign("env", list(op("extend_environment"), 
                         reg("val"), reg("stmt"), reg("env"))),
      perform(list(op("set_program_environment"), reg("env"))),
      restore("stmt"),
      assign("continue", label("print_result")),
      go_to(label("eval_dispatch")),

      "external_entry",
      perform(list(op("initialize_stack"))),
      assign("env", list(op("get_program_environment"))),
      assign("continue", label("print_result")),
      go_to(reg("val")),
      
      "print_result",
      perform(list(op("user_print"),
                   constant("EC-evaluate value:"), reg("val"))),
      // to avoid infinite REPL
      go_to(label("read_eval_print_loop")), 

      "eval_dispatch",
      test(list(op("is_literal"), reg("stmt"))),
      branch(label("ev_literal")),
      test(list(op("is_name"), reg("stmt"))),
      branch(label("ev_name")),
      // Treat let/const the same
      test(list(op("is_declaration"), reg("stmt"))),
      branch(label("ev_declaration")),
      test(list(op("is_assignment"), reg("stmt"))),
      branch(label("ev_assignment")),
      test(list(op("is_return_statement"), reg("stmt"))),
      branch(label("ev_return")),
      test(list(op("is_conditional"), reg("stmt"))),
      branch(label("ev_cond")),
      test(list(op("is_lambda_expression"), reg("stmt"))),
      branch(label("ev_lambda")),
      test(list(op("is_sequence"), reg("stmt"))),
      branch(label("ev_seq")),
      test(list(op("is_block"), reg("stmt"))),
      branch(label("ev_block")),
      test(list(op("is_application"), reg("stmt"))),
      branch(label("ev_application")),
      go_to(label("unknown_expression_type")),

      "ev_return_from_seq",
      restore("continue"),

      "ev_return",
      assign("stmt", list(op("return_expression"), reg("stmt"))),
      go_to(label("eval_dispatch")),
        
      "ev_literal",
      assign("val", list(op("literal_value"), reg("stmt"))),
      go_to(reg("continue")),
      
      "ev_name",
      assign("val",
        list(op("lookup_symbol_value"), reg("stmt"), reg("env"))),
      go_to(reg("continue")),
      
      "ev_lambda",
      assign("unev", list(op("lambda_parameter_symbols"), reg("stmt"))),
      assign("stmt", list(op("lambda_body"), reg("stmt"))),
      assign("val", list(op("make_function"),
                         reg("unev"), reg("stmt"), reg("env"))),
      go_to(reg("continue")),
      
      "ev_application",
      save("continue"),
      save("env"),
      assign("unev", list(op("args"), reg("stmt"))),
      save("unev"),
      assign("stmt", list(op("function_expression"), reg("stmt"))),
      assign("continue", label("ev_appl_did_operator")),
      go_to(label("eval_dispatch")),
      
      "ev_appl_did_operator",
      restore("unev"), // the args
      restore("env"),
      assign("argl", list(op("empty_arglist"))),
      assign("fun", reg("val")), // the function_expression
      test(list(op("has_no_operands"),
                reg("unev"))),
      branch(label("apply_dispatch")),
      save("fun"),
      
      "ev_appl_operand_loop",
      save("argl"),
      assign("stmt", list(op("first_arg"), reg("unev"))),
      test(list(op("is_last_operand"),
                reg("unev"))),
      branch(label("ev_appl_last_arg")),
      save("env"),
      save("unev"),
      assign("continue", label("ev_appl_accumulate_arg")),
      go_to(label("eval_dispatch")),
      
      "ev_appl_accumulate_arg",
      restore("unev"),
      restore("env"),
      restore("argl"),
      assign("argl", list(op("adjoin_arg"),
                          reg("val"), reg("argl"))),
      assign("unev", list(op("rest_args"), reg("unev"))),
      go_to(label("ev_appl_operand_loop")),
      
      "ev_appl_last_arg",
      assign("continue", label("ev_appl_accum_last_arg")),
      go_to(label("eval_dispatch")),
      
      "ev_appl_accum_last_arg",
      restore("argl"),
      assign("argl", list(op("adjoin_arg"),
                          reg("val"), reg("argl"))),
      restore("fun"),
      go_to(label("apply_dispatch")),
      
      "apply_dispatch",
      test(list(op("is_primitive_function"),
                reg("fun"))),
      branch(label("primitive_apply")),
      test(list(op("is_compound_function"),
                reg("fun"))),
      branch(label("compound_apply")),
      test(list(op("is_compiled_function"),
                reg("fun"))),
      branch(label("compiled_apply")),
      go_to(label("unknown_function_type")),

      "primitive_apply",
      assign("val", list(op("apply_primitive_function"), 
                         reg("fun"), 
                         reg("argl"))),
      restore("continue"),
      go_to(reg("continue")),
      
      "compound_apply",
      assign("unev", list(op("function_parameters"), reg("fun"))),
      assign("env", list(op("function_environment"), reg("fun"))),
      assign("env", list(op("extend_environment"), 
                         reg("unev"), 
                         reg("argl"), 
                         reg("env"))),
      assign("stmt", list(op("function_body"), reg("fun"))),
      test(list(op("does_not_return"),
                reg("stmt"), constant(false))),
      branch(label("no_return_wrapping")),
      restore("continue"),
      go_to(label("eval_dispatch")),
      "no_return_wrapping",
      assign("continue", label("end_without_return")),
      go_to(label("eval_dispatch")),

      "compiled_apply",
      restore("continue"),
      assign("val", list(op("compiled_function_entry"), reg("fun"))),
      go_to(reg("val")),
      
      "ev_seq",
      save("continue"),
      assign("unev", list(op("sequence_statements"), reg("stmt"))),

      "ev_sequence",
      assign("stmt", list(op("first_statement"), reg("unev"))),
      test(list(op("is_return_statement"), reg("stmt"))),
      branch(label("ev_return_from_seq")),
      test(list(op("is_last_statement"), reg("unev"))),
      branch(label("ev_sequence_last_exp")),
      save("unev"),
      save("env"),
      assign("continue", label("ev_sequence_continue")),
      go_to(label("eval_dispatch")),
      
      "ev_sequence_continue",
      restore("env"),
      restore("unev"),
      assign("unev", list(op("rest_statements"), reg("unev"))),
      go_to(label("ev_sequence")),
      
      "ev_sequence_last_exp",
      assign("continue", label("end_without_return")),
      go_to(label("eval_dispatch")),

      "end_without_return",
      assign("val", constant(undefined)),
      restore("continue"),
      go_to(reg("continue")),
        
      "ev_block",
      assign("stmt", list(op("block_body"), reg("stmt"))),
      assign("val", list(op("scan_out_declarations"), reg("stmt"))),

      save("stmt"), // Temporarily store to exp
      assign("stmt", list(op("list_of_unassigned"), reg("val"))),
      assign("env", list(op("extend_environment"), 
                         reg("val"), 
                         reg("stmt"), 
                         reg("env"))),
      restore("stmt"),
      go_to(label("eval_dispatch")),
      
      "ev_cond",
      save("stmt"), // save expression for later
      save("env"),
      save("continue"),
      assign("continue", label("ev_cond_decide")),
      assign("stmt", list(op("conditional_predicate"), reg("stmt"))),
      go_to(label("eval_dispatch")), // evaluate the predicate
      
      "ev_cond_decide",
      restore("continue"),
      restore("env"),
      restore("stmt"),
      test(list(op("is_truthy"), reg("val"))),
      branch(label("ev_cond_consequent")),
      
      "ev_cond_alternative",
      assign("stmt", list(op("conditional_alternative"), reg("stmt"))),
      go_to(label("eval_dispatch")),
      
      "ev_cond_consequent",
      assign("stmt", list(op("conditional_consequent"), reg("stmt"))),
      go_to(label("eval_dispatch")),
      
      "ev_assignment",
      assign("unev", list(op("assignment_symbol"), reg("stmt"))),
      save("unev"), // save variable for later
      assign("stmt", list(op("assignment_value_expression"), reg("stmt"))),
      save("env"),
      save("continue"),
      assign("continue", label("ev_assignment_1")),
      go_to(label("eval_dispatch")), // evaluate assignment value
      
      "ev_assignment_1",
      restore("continue"),
      restore("env"),
      restore("unev"),
      perform(list(op("assign_symbol_value"),
                   reg("unev"), reg("val"), reg("env"))),
      go_to(reg("continue")),
      
      "ev_declaration",
      assign("unev", list(op("declaration_symbol"),
                          reg("stmt"))),
      save("unev"), // save variable for later
      assign("stmt", list(op("declaration_value_expression"),
                          reg("stmt"))),
      save("env"),
      save("continue"),
      assign("continue", label("ev_declaration_assign")),
      go_to(label("eval_dispatch")), // evaluate declaration value
      
      "ev_declaration_assign",
      restore("continue"),
      restore("env"),
      restore("unev"),
      perform(list(op("assign_symbol_value"),
                   reg("unev"), reg("val"), reg("env"))),
      assign("val", constant(undefined)),
      go_to(reg("continue")),
      
      // Error handling
      "unknown_expression_type",
      assign("val", constant("unknown_expression_type_error")),
      go_to(label("signal_error")),
      
      "unknown_function_type",
      restore("continue"), /// clean up stack (from apply_dispatch)
      assign("val", constant("unknown_function_type_error")),
      go_to(label("signal_error")),
      
      "signal_error",
      perform(list(op("user_print"),
                   constant("EC_eval error:"), reg("val"))),
      go_to(label("read_eval_print_loop")),
      
      "evaluator_done"
     );

const eceval =
    make_machine(list("stmt", "env", "val", "fun",
                      "argl", "continue", "unev"),
                 eceval_operations,
                 eceval_controller);

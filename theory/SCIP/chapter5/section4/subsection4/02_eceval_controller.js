const eceval_controller =	
    list(
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

      "print_result",
      perform(list(op("user_print"),
                   constant("EC-evaluate value:"), reg("val"))),
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
        list(op("lookup_name_value"), reg("stmt"), reg("env"))),
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
      assign("continue", label("ev_appl_did_function_expression")),
      go_to(label("eval_dispatch")),
      
      "ev_appl_did_function_expression",
      restore("unev"), // the args
      restore("env"),
      assign("argl", list(op("empty_arglist"))),
      assign("fun", reg("val")), // the function_expression
      test(list(op("has_no_argument_expressions"),
                reg("unev"))),
      branch(label("apply_dispatch")),
      save("fun"),
      
      "ev_appl_argument_expression_loop",
      save("argl"),
      assign("stmt", list(op("first_arg"), reg("unev"))),
      test(list(op("is_last_argument_expression"),
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
      go_to(label("ev_appl_argument_expression_loop")),
      
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
                         reg("unev"), reg("argl"), reg("env"))),
      assign("stmt", list(op("function_body"), reg("fun"))),

      test(list(op("does_not_handle_return"), reg("stmt"))),
      branch(label("no_return_wrapping")),
      restore("continue"),
      go_to(label("eval_dispatch")),

      "no_return_wrapping",
      assign("continue", label("end_without_return")),
      go_to(label("eval_dispatch")),
   
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

      save("stmt"), // temporarily store to stmt
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

// functions from SICP JS 4.1.1
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

function get_register(machine, reg_name) {
    return machine("get_register")(reg_name);
}
function assign_reg_name(assign_instruction) {
    return head(tail(assign_instruction));
}
function assign_value_exp(assign_instruction) { 
    return head(tail(tail(assign_instruction)));
}
function lookup_prim(symbol, operations) {
    const val = assoc(symbol, operations);
    return is_undefined(val)
           ? error(symbol, "Unknown operation in assemble:")
           : head(tail(val));
}
function lookup_label(labels, label_name) {
    const val = assoc(label_name, labels);
    return is_undefined(val)
           ? error(label_name, "Undefined label in assemble:")
           : tail(val);
}
function make_primitive_exp(exp, machine, labels) {
    if (is_constant_exp(exp)) {
        const c = constant_exp_value(exp);
        return () => c;
    } else if (is_label_exp(exp)) {
        const insts = lookup_label(labels, label_exp_label(exp));
        return () => insts;
    } else if (is_register_exp(exp)) {
        const r = get_register(machine, register_exp_reg(exp));
        return () => get_contents(r); 
    } else {
        error(exp, "Unknown expression type in assemble:");
    }
}
function make_operation_exp(exp, machine, labels, operations) {
    const op = lookup_prim(operation_exp_op(exp), operations);
    const aprocs = map(e => make_primitive_exp(e, machine, labels),
                       operation_exp_operands(exp));
    return () => apply_in_underlying_javascript(
                     op, map(p => p(), aprocs));
}
function assign(register_name, source) {
    return list("assign", register_name, source);
}
function make_assign(inst, machine, labels, operations, pc) {
    const target = get_register(machine, assign_reg_name(inst));
    const value_exp = assign_value_exp(inst);
    const value_fun =
        is_operation_exp(value_exp)
        ? make_operation_exp(value_exp, machine, labels, operations)
        : make_primitive_exp(value_exp, machine, labels);
    return () => {
        set_contents(target, value_fun());
        advance_pc(pc); 
    };
}
function advance_pc(pc) {
    set_contents(pc, tail(get_contents(pc))); 
}
function make_test(inst, machine, labels, operations, flag, pc) {
    const condition = test_condition(inst);
    if (is_operation_exp(condition)) {
        const condition_fun = make_operation_exp(condition,
                                  machine, labels, operations);
        return () => {
                       set_contents(flag, condition_fun());
                       advance_pc(pc); 
                     };
    } else {
        error(inst, "Bad test instruction in assemble:");
    }
}
function test(sequence) { return list("test", sequence); }
function test_condition(test_inst) { return head(tail(test_inst)); }
function make_branch(inst, machine, labels, flag, pc) {
    const dest = branch_dest(inst);
    if (is_label_exp(dest)) {
        const insts = lookup_label(labels, label_exp_label(dest));
        return () => {
                       if (get_contents(flag)) {
                           set_contents(pc, insts);
                       } else {
                           advance_pc(pc);
                       }
                     };
    } else {
        error(inst, "Bad branch instruction in assemble:");
    }
}
function branch(label) { return list("branch", label); }
function branch_dest(branch_inst) { return head(tail(branch_inst)); }
function reg(name) { return list("reg", name); }

function is_register_exp(exp) { return is_tagged_list(exp, "reg"); }

function register_exp_reg(exp) { return head(tail(exp)); }

function constant(value) { return list("constant", value); }

function is_constant_exp(exp) { return is_tagged_list(exp, "constant"); }

function constant_exp_value(exp) { return head(tail(exp)); }

function label(name) { return list("label", name); }

function is_label_exp(exp) { return is_tagged_list(exp, "label"); }

function label_exp_label(exp) { return head(tail(exp)); }
function make_go_to(inst, machine, labels, pc) {
    const dest = go_to_dest(inst);
    if (is_label_exp(dest)) {
        const insts = lookup_label(labels, label_exp_label(dest));
        return () => set_contents(pc, insts);
    } else if (is_register_exp(dest)) {
        const reg = get_register(machine, register_exp_reg(dest));
        return () => set_contents(pc, get_contents(reg));
    } else {
        error(inst, "Bad go_to instruction in assemble:");
    }
}
function go_to(label) { return list("go_to", label); }
function go_to_dest(go_to_inst) { return head(tail(go_to_inst)); }
function pop(stack) {
    return stack("pop");
}
function push(stack, value) {
    return stack("push")(value);
}
function make_save(inst, machine, stack, pc) {
    const reg = get_register(machine, stack_inst_reg_name(inst));
    return () => {
                   push(stack, get_contents(reg));
                   advance_pc(pc);
                 };
}
function make_restore(inst, machine, stack, pc) {
    const reg = get_register(machine, stack_inst_reg_name(inst));
    return () => {
                   set_contents(reg, pop(stack));
                   advance_pc(pc); 
                 };
}

function save(reg) { return list("save", reg); }
function restore(reg) { return list("restore", reg); }
function stack_inst_reg_name(stack_instruction) {
    return head(tail(stack_instruction));
}
function op(name) {
    return list("op", name);
}
function is_operation_exp(exp) {
    return is_pair(exp) && is_tagged_list(head(exp), "op");
}
function operation_exp_op(operation_exp) {
    return head(tail(head(operation_exp)));
}
function operation_exp_operands(operation_exp) {
    return tail(operation_exp);
}
function make_perform(inst, machine, labels, operations, pc) {
    const action = perform_action(inst);
    if (is_operation_exp(action)) {
        const action_fun = make_operation_exp(action, machine,
                                            labels, operations);
        return () => { 
                       action_fun(); advance_pc(pc); 
                     };
    } else {
        error(inst, "Bad perform instruction in assemble");
    }
}
function perform(action) { return list("perform", action); }
function perform_action(inst) { return head(tail(inst)); }
function make_execution_function(inst, labels, machine, 
                                 pc, flag, stack, ops) {
    return head(inst) === "assign"
           ? make_assign(inst, machine, labels, ops, pc)
           : head(inst) === "test"
           ? make_test(inst, machine, labels, ops, flag, pc)
           : head(inst) === "branch"
           ? make_branch(inst, machine, labels, flag, pc)
           : head(inst) === "go_to"
           ? make_go_to(inst, machine, labels, pc)
           : head(inst) === "save"
           ? make_save(inst, machine, stack, pc)
           : head(inst) === "restore"
           ? make_restore(inst, machine, stack, pc)
           : head(inst) === "perform"
           ? make_perform(inst, machine, labels, ops, pc)
           : error(inst, "Unknown instruction type in assemble:");
}
function make_instruction(text) {
    return pair(text, null);
}
function instruction_text(inst) {
    return head(inst);
}
function instruction_execution_fun(inst) {
    return tail(inst);
}
function set_instruction_execution_fun(inst, proc) {
    set_tail(inst, proc); 
}
function update_insts(insts, labels, machine) {
    const pc = get_register(machine, "pc");
    const flag = get_register(machine, "flag");
    const stack = machine("stack");
    const ops = machine("operations");
    return for_each(
        inst => set_instruction_execution_fun(
            inst,
            make_execution_function(instruction_text(inst),
                                    labels,
                                    machine,
                                    pc,
                                    flag,
                                    stack,
                                    ops)),
        insts);
}
function make_label_entry(label_name, insts) {
    return pair(label_name, insts);
}
function extract_labels(text, receive) {
    return is_null(text)
           ? receive(null, null)
           : extract_labels(tail(text), 
               (insts, labels) => {
                   const next_inst = head(text);
                   return is_string(next_inst)
                          ? receive(insts, 
                                    pair(make_label_entry(next_inst, 
                                                          insts), 
                                         labels))
                          : receive(pair(make_instruction(next_inst), 
                                         insts),
                                    labels); 
               });
}
function assemble(controller_text, machine) {
    return extract_labels(controller_text,
        (insts, labels) => {
           update_insts(insts, labels, machine);
           return insts;
        });
}
function make_stack() {
    let stack = null;
    function push(x) { 
        stack = pair(x, stack); 
        return "done";
    }
    function pop() {
        if (is_null(stack)) {
            error("Empty stack: pop");
        } else {
            const top = head(stack);
            stack = tail(stack);
            return top;
        }
    }
    function initialize() {
        stack = null;
        return "done";
    }
    function dispatch(message) {
        return message === "push"
               ? push
               : message === "pop"
               ? pop()
               : message === "initialize"
               ? initialize()
               : error(message, "Unknown request in stack:");
    }
    return dispatch;
}
function make_register(name) {
    let contents = "*unassigned*";
    function dispatch(message) {
        return message === "get"
               ? contents
               : message === "set"
               ? value => { contents = value; }
               : error(message, 
                       "Unknown request in make_register:");
    }
    return dispatch;
}
function assoc(key, records) {
    return is_null(records)
           ? undefined
           : equal(key, head(head(records)))
           ? head(records)
           : assoc(key, tail(records));
}
function get_contents(register) {
    return register("get");
}
function set_contents(register, value) {
    return register("set")(value);
}
function make_new_machine() {
    const pc = make_register("pc");
    const flag = make_register("flag");
    const stack = make_stack();
    let the_instruction_sequence = null;
    let the_ops = list(list("initialize_stack", 
                            () => stack("initialize")));
    let register_table = list(list("pc", pc), list("flag", flag));

    function allocate_register(name) {
        if (is_undefined(assoc(name, register_table))) {
            register_table = pair(list(name, make_register(name)),
                                  register_table);
        } else {
            error(name, "Multiply defined register:");
        }
        return "register_allocated";
    }
    function lookup_register(name) {
        const val = assoc(name, register_table);
        return is_undefined(val)
               ? error(name, "Unknown register:")
               : head(tail(val));
    }
    function execute() {
        const insts = get_contents(pc);
        if (is_null(insts)) {
            return "done";
        } else {
            instruction_execution_fun(head(insts))();
            return execute();
        }
    }
    function dispatch(message) {
        function start() {
            set_contents(pc, the_instruction_sequence);
            return execute();
        }
        return message === "start"
               ? start()
               : message === "install_instruction_sequence"
               ? seq => { the_instruction_sequence = seq; }
               : message === "allocate_register"
               ? allocate_register
               : message === "get_register"
               ? lookup_register
               : message === "install_operations"
               ? ops => { the_ops = append(the_ops, ops); }
               : message === "stack"
               ? stack
               : message === "operations"
               ? the_ops
               : error(message, "Unknown request in machine:");
    }
    return dispatch;
}
function make_machine(register_names, ops, controller_text) {
    const machine = make_new_machine();
    for_each(register_name => 
                 machine("allocate_register")(register_name), 
             register_names);
    machine("install_operations")(ops);
    machine("install_instruction_sequence")
           (assemble(controller_text, machine));
    return machine;
}
function start(machine) {
    return machine("start");
}
function get_register_contents(machine, register_name) {
    return get_contents(get_register(machine, register_name));
}
function set_register_contents(machine, register_name, value) {
    set_contents(get_register(machine, register_name), value);
    return "done";
}
function compile(component, target, linkage) {
    return is_literal(component)
           ? compile_literal(component, target, linkage)
           : is_name(component)
           ? compile_name(component, target, linkage)
           : is_application(component)
           ? compile_application(component, target, linkage)
           : is_operator_combination(component)           //TODO
           ? compile_operator_combination(component, env) //TODO
           : is_conditional(component)
           ? compile_conditional(component, target, linkage)
           : is_lambda_expression(component)
           ? compile_lambda_expression(component, target, linkage)
           : is_sequence(component)
           ? compile_sequence(sequence_statements(component), target, linkage)
           : is_block(component)
           ? compile_block(component, target, linkage)
           : is_return_statement(component)
           ? compile_return_statement(component, target, linkage) 
           : is_declaration(component)
           ? compile_declaration(component, target, linkage)
           : is_assignment(component)
           ? compile_assignment(component, target, linkage)
           : error(component, "Unknown component type -- compile");
}
function make_instruction_sequence(needs, modifies, instructions) {
    return list(needs, modifies, instructions);
}
function empty_instruction_sequence() {
    return make_instruction_sequence(null, null, null);
}
function compile_linkage(target, linkage) {
    return linkage === "return"
           ? make_instruction_sequence(
                 list("continue"), 
                 null,
                 list(go_to(reg("continue"))))
           : linkage === "return_undefined"
           ? make_instruction_sequence(
                 list("continue"), 
                 list(target),
                 list(assign(target, constant(undefined)),
                      go_to(reg("continue"))))
           : linkage === "next"
           ? empty_instruction_sequence()
           : make_instruction_sequence(null, null, 
                 list(go_to(label(linkage))));
}
function end_with_linkage(target, linkage, instruction_sequence) {
    return preserving(list("continue"),
                      instruction_sequence,
                      compile_linkage(target, linkage));
}
function compile_literal(component, target, linkage) {
    return end_with_linkage(target, linkage,
               make_instruction_sequence(
                   null,
                   list(target),
                   list(assign(target, constant(literal_value(component))))));
}

function compile_name(component, target, linkage) {
    return end_with_linkage(target, linkage,
               make_instruction_sequence(list("env"), list(target),
                   list(assign(target, 
                               list(op("lookup_symbol_value"),
                                    constant(component), reg("env"))))));
}
function compile_assignment(component, target, linkage) {
    const symbol = assignment_symbol(component);
    const value_code =
              compile(assignment_value_expression(component), "val", "next");
    return compile_assignment_returning(symbol,
               value_code, target, linkage, reg("val"));
}

function compile_declaration(component, target, linkage) {
    const symbol = declaration_symbol(component);
    const value_code = compile(declaration_value_expression(component), "val", "next");
    return compile_assignment_returning(symbol,
               value_code, target, linkage, constant(undefined));
}

function compile_assignment_returning(
             symbol, value_code, target, linkage, return_val) {
    return end_with_linkage(target, linkage,
               preserving(
                   list("env"),
                   value_code,
                   make_instruction_sequence(
                       list("env", "val"),
                       list(target),
                       list(perform(
                                list(op("assign_symbol_value"),
                                     constant(symbol),
                                     reg("val"),
                                     reg("env"))),
                            assign(target, return_val)))));
}
let label_counter = 0;

function new_label_number() {
    label_counter = label_counter + 1;
    return label_counter;
}

function make_label(name) {
    return name + stringify(new_label_number());
}
function compile_conditional(component, target, linkage) {
    let t_branch = make_label("true_branch");
    let f_branch = make_label("false_branch");
    let after_cond = make_label("after_cond");
    let consequent_linkage =
            linkage === "next" ? after_cond : linkage;
    let p_code = compile(conditional_predicate(component), "val", "next");
    let c_code = compile(conditional_consequent(component),
                         target, consequent_linkage);
    let a_code = compile(conditional_alternative(component),
                         target, linkage);
    return preserving(
             list("env", "continue"),
               p_code,
               append_instruction_sequences(
                 make_instruction_sequence(
                   list("val"),
                     list(),
                     list(test(list(op("is_falsy"), reg("val"))),
                          branch(label(f_branch)))),
                 append_instruction_sequences(
                   parallel_instruction_sequences(
                     append_instruction_sequences(t_branch, c_code),
                     append_instruction_sequences(f_branch, a_code)),
                   after_cond)));
}
function compile_sequence(seq, target, linkage) {
    return is_last_statement(seq)
           ? compile(first_statement(seq), target, linkage)
           : preserving(
               list("env", "continue"),
               compile(first_statement(seq), target, "next"),
               compile_sequence(rest_statements(seq), target, linkage));
}
function make_compiled_function(entry, env) {
    return list("compiled_function", entry, env);
}

function is_compiled_function(proc) {
    return is_tagged_list(proc, "compiled_function");
} 

function compiled_function_entry(c_proc) {
    return head(tail(c_proc));
}

function compiled_function_env(c_proc) {
    return head(tail(tail(c_proc)));
}
function compile_lambda_expression(exp, target, linkage) {
    let fun_entry = make_label("entry");
    let after_lambda = make_label("after_lambda"); 
    let lambda_linkage =
            linkage === "next" ? after_lambda : linkage;
    return append_instruction_sequences(
        tack_on_instruction_sequence(
          end_with_linkage(target, lambda_linkage,
            make_instruction_sequence(list("env"), list(target),
              list(assign(target, 
                          list(op("make_compiled_function"),
                               label(fun_entry), reg("env")))))),
          compile_lambda_body(exp, fun_entry)),
         after_lambda);
}
function compile_lambda_body(exp, fun_entry) {
    let params  = lambda_parameter_symbols(exp);
    return append_instruction_sequences(
        make_instruction_sequence(
            list("env", "fun", "argl"),
            list("env"),
            list(fun_entry,
                 assign("env", list(op("compiled_function_env"), 
                                    reg("fun"))),
                 assign("env", list(op("extend_environment"), 
                                    constant(params),
                                    reg("argl"), 
                                    reg("env"))))),
        compile(lambda_body(exp), "val", "return_undefined"));
}
function compile_return_statement(stmt, target, linkage) {
    return compile(return_expression(stmt), target, "return");
}
function compile_block(stmt, target, linkage) {
    const body = block_body(stmt);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigned(locals);
    return append_instruction_sequences(
               make_instruction_sequence(
                   list("env", "fun", "argl"),
                   list("env"),
                   list(assign("env", list(op("extend_environment"), 
                                           constant(locals),
                                           constant(unassigneds),
                                           reg("env"))))),
               compile(body(stmt), target, linkage));
}
function compile_application(exp, target, linkage) {
    const fun_code = compile(function_expression(exp), "fun", "next"); 
    const arguments_codes =
              map(arg => compile(arg, "val", "next"),
                  args(exp));
    return preserving(list("env", "continue"), 
               fun_code,
               preserving(list("fun", "continue"), 
                   construct_arglist(arguments_codes),
                       compile_function_call(target, linkage)));
}
function construct_arglist(arg_codes) {
    const rev_arg_codes = reverse(arg_codes);
    if (is_null(arg_codes)) {
        return make_instruction_sequence(
            null, 
            list("argl"),
            list(assign("argl", constant(null))));
    } else {
        const code_to_get_last_arg =
              append_instruction_sequences(
                  head(rev_arg_codes),
                  make_instruction_sequence(
                      list("val"),
                      list("argl"),
                      list(assign("argl", list(op("list"), 
                                               reg("val"))))));
        return is_null(tail(rev_arg_codes))
               ? code_to_get_last_arg
               : preserving(
                   list("env"),
                   code_to_get_last_arg,
                   code_to_get_rest_args(tail(rev_arg_codes)));
    }
}

function code_to_get_rest_args(arg_codes) {
    const code_for_next_arg = preserving(
        list("argl"), 
        head(arg_codes),
        make_instruction_sequence(
            list("val", "argl"), 
            list("argl"),
            list(assign("argl", list(op("pair"), 
                                     reg("val"), reg("argl"))))));
    return is_null(tail(arg_codes))
           ? code_for_next_arg
           : preserving(list("env"),
                        code_for_next_arg,
                        code_to_get_rest_args(tail(arg_codes)));
}
function compile_function_call(target, linkage) {
    const primitive_branch = make_label("primitive_branch");
    const compiled_branch = make_label("compiled_branch");
    const after_call = make_label("after_call");
    const compiled_linkage = linkage === "next" ? after_call : linkage;
    return append_instruction_sequences(
        make_instruction_sequence(
            list("fun"),
            list(),
            list(test(list(op("is_primitive_function"), reg("fun"))),
                 branch(label(primitive_branch)))), 
        append_instruction_sequences(
            parallel_instruction_sequences(
                append_instruction_sequences(
                    compiled_branch,
                    compile_fun_appl(target, compiled_linkage)),
                append_instruction_sequences(
                    primitive_branch,
                    end_with_linkage(target, linkage,
                        make_instruction_sequence(
                            list("fun", "argl"),
                            list(target),
                            list(assign(target,
                                    list(op("apply_primitive_function"),
                                         reg("fun"), reg("argl")))))))),
            after_call));
}
const all_regs = list("env", "fun", "val", "argl", "continue");
function compile_fun_appl(target, linkage) {
    if (target === "val" && linkage !== "return") {
        return make_instruction_sequence(
            list("fun"),
            all_regs,
            list(
                assign("continue", label(linkage)),
                assign("val", list(op("compiled_function_entry"), 
                                   reg("fun"))),
                go_to(reg("val"))));
    } else if (target !== "val" && linkage !== "return") {
        const fun_return = make_label("fun_return");
        return make_instruction_sequence(
            list("fun"),
            all_regs,
            list(
                assign("continue", label(fun_return)),
                assign("val", list(op("compiled_function_entry"), 
                                   reg("fun"))),
                go_to(reg("val")),
                fun_return,
                assign(target, reg("val")),
                go_to(label(linkage))));
    } else if (target === "val" && linkage === "return") {
        return make_instruction_sequence(
            list("fun", "continue"),
            all_regs,
            list(
                assign("val", list(op("compiled_function_entry"), 
                                   reg("fun"))),
                go_to(reg("val"))));
    } else if (target !== "val" && linkage === "return") {
        error(target, "return linkage, target not val -- compile");
    } else {}
}
function registers_needed(s) {
     return is_string(s) ? null : head(s);
}

function registers_modified(s) {
     return is_string(s) ? null : head(tail(s));
}

function instructions(s) {
     return is_string(s) ? list(s) : head(tail(tail(s)));
}
function needs_register(seq, reg) {
    return ! is_null(member(reg, registers_needed(seq)));
}

function modifies_register(seq, reg) {
    return ! is_null(member(reg, registers_modified(seq)));
}
function append_instruction_sequences(seq1, seq2) {
    return make_instruction_sequence(
              list_union(registers_needed(seq1),
                  list_difference(registers_needed(seq2),
                      registers_modified(seq1))),
              list_union(registers_modified(seq1),
                      registers_modified(seq2)),
              append(instructions(seq1), instructions(seq2)));
}
function list_union(s1, s2) {
    return is_null(s1)
           ? s2
           : is_null(member(head(s1), s2))
           ? pair(head(s1), list_union(tail(s1), s2))
           : list_union(tail(s1), s2);
}

function list_difference(s1, s2) {
    return is_null(s1)
           ? null
           : is_null(member(head(s1), s2))
           ? pair(head(s1), list_difference(tail(s1), s2))
           : list_difference(tail(s1), s2);
}
function preserving(regs, seq1, seq2) {
    if (is_null(regs)) {
        return append_instruction_sequences(seq1, seq2);
    } else {
        const first_reg = head(regs);
        if (needs_register(seq2, first_reg) &&
            modifies_register(seq1, first_reg)) {
            return preserving(
                tail(regs),
                make_instruction_sequence(
                    list_union(list(first_reg),
                               registers_needed(seq1)),
                    list_difference(registers_modified(seq1),
                                    list(first_reg)),
                    append(list(save(first_reg)),
                           append(instructions(seq1),
                                  list(restore(first_reg))))),
                seq2);
        } else {
            return preserving(tail(regs), seq1, seq2);
        }
    }
}
function tack_on_instruction_sequence(seq, body_seq) {
    return make_instruction_sequence(
        registers_needed(seq),
        registers_modified(seq),
        append(instructions(seq), instructions(body_seq)));
}
function parallel_instruction_sequences(seq1, seq2) {
    return make_instruction_sequence(
        list_union(
            registers_needed(seq1),
            registers_needed(seq2)),
        list_union(
            registers_modified(seq1),
            registers_modified(seq2)),
        append(
            instructions(seq1),
            instructions(seq2)));
}
function user_print(prompt_string, object) {
   function to_string(object) {
       return is_compound_function(object)
              ? "<compound-function>"
              : is_compiled_function(object)
              ? "<compiled-function>"
              : is_primitive_function(object)
              ? "<primitive-function>"
              : is_pair(object)
              ? "[" + to_string(head(object)) + ", "
                    + to_string(tail(object)) + "]"
              : stringify(object);
    }
    display("----------------------------",
            prompt_string + "\n" + to_string(object) + "\n");
}
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
function stringify_list(xs) {
    return is_null(member(head(xs),
                   list("assign", "perform", "op", "label", "branch",
                        "go_to", "save", "restore", "reg", "constant")))
           ? "list(" + comma_separated(xs) + ")"
           : head(xs) + "(" + comma_separated(tail(xs)) + ")";
}
function comma_separated(elements) {
    return accumulate((s, acc) => stringify_instruction(s) +
                                  (acc === "" ? "" : ", " + acc),
                      "", elements);
}
function stringify_instruction(x) {
    return is_string(x) || is_number(x) || is_undefined(x) || is_null(x)
           ? stringify(x)
           : stringify_list(x);
}
function display_instructions(instructions) {
    return for_each(i => {display("", stringify_instruction(i) + ","); },
                    instructions);
}
function compile_and_go(stmt) {
    const toplevel_names = scan_out_declarations(stmt);
    const unassigneds = list_of_unassigned(toplevel_names);
    set_program_environment(
        extend_environment(toplevel_names, unassigneds, 
            the_global_environment));
    const instr_sequence = compile(stmt, "val", "return");
    const instrs = assemble(instructions(instr_sequence),
                            eceval);
    set_register_contents(eceval, "val", instrs);
    set_register_contents(eceval, "flag", true);
    return start(eceval);
}


compile_and_go(
    parse(
        "function factorial(n) {             \
             return n === 1                  \
                    ? 1                      \
                    : n * factorial(n - 1);  \
         }"));

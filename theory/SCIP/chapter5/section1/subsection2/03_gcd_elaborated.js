function controller(sequence) {	
    return list("controller", sequence);
}
function controller_sequence(controller) {
    return head(tail(controller));
}
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
function is_tagged_list(component, the_tag) {
    return is_pair(component) && head(component) === the_tag;
}
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
const gcd_elaborated_controller =
controller(
  list(
    "test_b",
      test(list(op("="), reg("b"), constant(0))),
      branch(label("gcd_done")),
      assign("t", reg("a")),
    "rem_loop",
      test(list(op("<"), reg("t"), reg("b"))),
      branch(label("rem_done")),
      assign("t", list(op("-"), reg("t"), reg("b"))),
      go_to(label("rem_loop")),
    "rem_done",
      assign("a", reg("b")),
      assign("b", reg("t")),
      go_to(label("test_b")),
    "gcd_done"))

;
	  
const gcd_elaborated_machine =
    make_machine(
        list("a", "b", "t"),
        list(list("=", (a, b) => a === b),
             list("<", (a, b) => a < b),
             list("-", (a, b) => a - b)),
        controller_sequence(gcd_elaborated_controller));

set_register_contents(gcd_elaborated_machine, "a", 206);
set_register_contents(gcd_elaborated_machine, "b", 40);
start(gcd_elaborated_machine);
get_register_contents(gcd_elaborated_machine, "a");

// expected: 2

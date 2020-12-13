function is_tagged_list(component, the_tag) {
    return is_pair(component) && head(component) === the_tag;
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

function perform(action) { return list("perform", action); }
function perform_action(inst) { return head(tail(inst)); }

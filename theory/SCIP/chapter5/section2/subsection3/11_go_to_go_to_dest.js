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

function go_to(label) { return list("go_to", label); }
function go_to_dest(go_to_inst) { return head(tail(go_to_inst)); }

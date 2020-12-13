function get_signal(wire) {
    return wire("get_signal");
}

function set_signal(wire, new_value) {
    return wire("set_signal")(new_value);
}

function add_action(wire, action_function) {
    return wire("add_action")(action_function);
}
function make_time_segment(time, queue) {
    return pair(time, queue);
}

function segment_time(s) { return head(s); }

function segment_queue(s) { return tail(s); }
function make_queue() {
    return pair(null, null);
}
function front_ptr(queue) {
    return head(queue);
}
function rear_ptr(queue) {
    return tail(queue);
}
function set_front_ptr(queue, item) {
    set_head(queue, item);
}
function set_rear_ptr(queue, item) {
    set_tail(queue, item);
}
function is_empty_queue(queue) {
    return is_null(front_ptr(queue));
}
function insert_queue(queue, item) {
    const new_pair = pair(item, null);
    if (is_empty_queue(queue)) {
        set_front_ptr(queue, new_pair);
        set_rear_ptr(queue, new_pair);
    } else {
        set_tail(rear_ptr(queue), new_pair);
        set_rear_ptr(queue, new_pair);
    }
    return queue;
}
function make_agenda() { return list(0); }

function current_time(agenda) { return head(agenda); }

function set_current_time(agenda, time) {
    set_head(agenda, time);
}

function segments(agenda) { return tail(agenda); }

function set_segments(agenda, segs) {
    set_tail(agenda, segs);
}

function first_segment(agenda) { return head(segments(agenda)); }

function rest_segments(agenda) { return tail(segments(agenda)); }
function add_to_agenda(time, action, agenda) {
    function belongs_before(segs) {
        return is_null(segs) ||
               time < segment_time(head(segs));
    }
    function make_new_time_segment(time, action) {
        const q = make_queue();
        insert_queue(q, action);
        return make_time_segment(time, q);
    }
    function add_to_segments(segs) {
        if (segment_time(head(segs)) === time) {
            insert_queue(segment_queue(head(segs)), action);
        } else {
            const rest = tail(segs);
            if (belongs_before(rest)) {
                set_tail(segs,
                    pair(make_new_time_segment(time, action),
                         tail(segs)));
            } else {
                add_to_segments(rest);
            }
        }
    }
    const segs = segments(agenda);
    if (belongs_before(segs)) {
        set_segments(agenda,
            pair(make_new_time_segment(time, action),
                 segs));
    } else {
        add_to_segments(segs);
    }
}
const the_agenda = make_agenda();
const inverter_delay = 2;
const and_gate_delay = 3;
const or_gate_delay = 5;
function after_delay(delay, action) {
    add_to_agenda(delay + current_time(the_agenda),
                  action, the_agenda);
}
function call_each(functions) {
    if (is_null(functions)) {
        return "done";
    } else {
        head(functions)();
        return call_each(tail(functions));
    }
}
function make_wire() {
    let signal_value = 0;
    let action_functions = null;
    function set_my_signal(new_value) {
        if (signal_value !== new_value) {
            signal_value = new_value;
            return call_each(action_functions);
        } else {
            return "done";
        }
    }
    function accept_action_function(fun) {
        action_functions = pair(fun, action_functions);
        fun();
    }
    function dispatch(m) {
        return m === "get_signal"
               ? signal_value
               : m === "set_signal"
               ? set_my_signal
               : m === "add_action"
               ? accept_action_function
               : error(m, "Unknown operation -- wire");
    }
    return dispatch;
}
const a = make_wire();
const b = make_wire();
const c = make_wire();
const d = make_wire();
const e = make_wire();
const s = make_wire();
function inverter(input, output) {
    function invert_input() {
        const new_value = logical_not(get_signal(input));
        after_delay(inverter_delay, 
                    () => set_signal(output, new_value));
    }
    add_action(input, invert_input);
    return "ok";
}

function logical_not(s) {
    return s === 0
           ? 1
           : s === 1
           ? 0
           : error(s, "Invalid signal");
}

inverter(c, e);

// expected: 'ok'

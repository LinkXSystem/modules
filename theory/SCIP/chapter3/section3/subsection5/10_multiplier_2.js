function has_value(connector) {
    return connector("has_value");
}

function get_value(connector) {
    return connector("value");
}

function set_value(connector, new_value, informant) {
    return connector("set_value")(new_value, informant);
}

function forget_value(connector, retractor) {
    return connector("forget")(retractor);
}

function connect(connector, new_constraint) {
    return connector("connect")(new_constraint);
}
function multiplier(m1, m2, product) {
    function process_new_value() {
        if ((has_value(m1) && get_value(m1) === 0)
         || (has_value(m2) && get_value(m2) === 0)) {
            set_value(product, 0, me);
        } else if (has_value(m1) && has_value(m2)) {
            set_value(product, 
                      get_value(m1) * get_value(m2), 
		      me);
        } else if (has_value(product) && has_value(m1)) {
            set_value(m2, 
                      get_value(product) / get_value(m1), 
                      me);
        } else if (has_value(product) && has_value(m2)) {
            set_value(m1, 
	              get_value(product) / get_value(m2),
	              me);
        } else {}
    }
    function process_forget_value() {
        forget_value(product, me);
        forget_value(m1, me);
        forget_value(m2, me);
        process_new_value();
    }
    function me(request) {
        if (request === "I_have_a_value") {
            process_new_value();
        } else if (request === "I_lost_my_value") {
            process_forget_value();
        } else {
            error(request, "Unknown request -- multiplier");
        }
    }
    connect(m1, me);
    connect(m2, me);
    connect(product, me);
    return me;
}

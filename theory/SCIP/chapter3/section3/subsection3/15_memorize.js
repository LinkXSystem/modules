function make_table() {
    return list("*table*");
}
function assoc(key, records) {
    return is_null(records)
           ? undefined
           : equal(key, head(head(records)))
           ? head(records)
           : assoc(key, tail(records));
}
function lookup(key, table) {
    const record = assoc(key, tail(table));
    return is_undefined(record)
           ? undefined
           : tail(record);
}
function insert(key, value, table) {
    const record = assoc(key, tail(table));
    if (is_undefined(record)) {
        set_tail(table, pair(pair(key, value),
                             tail(table)));
    } else {
        set_tail(record, value);
    }
    return "ok";
}
function memoize(f) {
    const table = make_table();
    return x => {
        const previously_computed_result 
            = lookup(x, table);
        if (is_undefined(previously_computed_result)) {
            const result = f(x);
            insert(x, result, table);
            return result;
        } else {
            return previously_computed_result;
        }
    };
}

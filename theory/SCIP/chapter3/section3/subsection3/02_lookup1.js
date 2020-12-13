function assoc(key, records) {
    return is_null(records)
           ? undefined
           : equal(key, head(head(records)))
           ? head(records)
           : assoc(key, tail(records));
}
function make_table() {
    return list("*table*");
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
function lookup(key, table) {
    const record = assoc(key, tail(table));
    return is_undefined(record)
           ? undefined
           : tail(record);
}

const t = make_table();
insert("a", 10, t);
lookup("a", t);

// expected: 10

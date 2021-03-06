function make_record(key, data) {	  
    return pair(key, data);
}
function key(record) {    
    return head(record);
}
function data(record) {
    return tail(record);
}
function lookup(given_key, set_of_records) {
    return is_null(set_of_records)
           ? false
           : equal(given_key, key(head(set_of_records)))
           ? head(set_of_records)
           : lookup(given_key, tail(set_of_records));
}

lookup(3, list(make_record(2, "Venus"), 
               make_record(5, "Jupiter"),
               make_record(4, "Mars"),
               make_record(3, "Earth"),
               make_record(6, "Saturn")));

// expected: [ 3, 'Earth' ]

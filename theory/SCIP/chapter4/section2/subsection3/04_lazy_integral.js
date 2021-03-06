// chapter=2 variant=lazy 
function pair(x, y) {	
    return m => m(x, y);
}
function head(z) {    
    return z( (p, q) => p );
}
function tail(z) {
    return z( (p, q) => q );
}
function list_ref(items, n) {	
    return n === 0
           ? head(items)
           : list_ref(tail(items), n - 1);
}
function map(fun, items) {	   
    return is_null(items)
           ? null
           : pair(fun(head(items)),
                  map(fun, tail(items)));
}
function scale_list(items, factor) {
    return map(x => x * factor, items);
}
function add_lists(list1, list2) {
    return is_null(list1)
           ? list2
           : is_null(list2)    
           ? list1
           : pair(head(list1) + head(list2),
                  add_lists(tail(list1), tail(list2)));
}
const ones = pair(1, ones);
const integers = pair(1, add_lists(ones, integers));
function integral(integrand, initial_value, dt) {	
    const int =
        pair(initial_value,
             add_lists(scale_list(integrand, dt),
                       int));
    return int;
}
function solve(f, y0, dt) {
    const y = integral(dy, y0, dt);
    const dy = map(f, y);
    return y;
}
list_ref(solve(x => x, 1, 0.002), 500);

// expected: 2.715568520651728

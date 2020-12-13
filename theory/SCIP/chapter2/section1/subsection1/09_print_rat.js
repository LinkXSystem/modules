function make_rat(n, d) {
    return pair(n, d);
}
function numer(x) {
    return head(x);
}
function denom(x) {
    return tail(x);
}
// printing the rational in one line requires some string
// manipulation: stringify turns a number into a string 
// and the operator + can be applied to strings for
// string concatenation
function print_rat(x) {
    display(stringify(numer(x)) + "/" + stringify(denom(x)));
}

const one_half = make_rat(1, 2);

print_rat(one_half);

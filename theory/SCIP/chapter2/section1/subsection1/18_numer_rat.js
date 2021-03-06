function numer(x) {
    return head(x);
}
function denom(x) {
    return tail(x);
}
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
function make_rat(n, d) {
    const g = gcd(n, d);
    return pair(n / g, d / g);
}
function add_rat(x, y) {
    return make_rat(numer(x) * denom(y) + numer(y) * denom(x),
                    denom(x) * denom(y));
}
function sub_rat(x, y) {
    return make_rat(numer(x) * denom(y) - numer(y) * denom(x),
                    denom(x) * denom(y));
}
function mul_rat(x, y) {
    return make_rat(numer(x) * numer(y),
                    denom(x) * denom(y));
}
function div_rat(x, y) {
    return make_rat(numer(x) * denom(y),
                    denom(x) * numer(y));
}
function equal_rat(x, y) {
    return numer(x) * denom(y) === numer(y) * denom(x);
}
const one_third = make_rat(1, 3);
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
print_rat(add_rat(one_third, one_third));

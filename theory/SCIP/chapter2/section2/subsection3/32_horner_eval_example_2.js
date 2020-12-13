function horner_eval(x, coefficient_sequence) {
    return accumulate((this_coeff, higher_terms) => 
                      x * higher_terms + this_coeff,
                      0, 
                      coefficient_sequence);
}
function horner_eval(x, coefficient_sequence) {
    return accumulate((this_coeff, higher_terms) => $\langle ??\rangle$,
                      0, 
                      coefficient_sequence);
}
horner_eval(2, list(1, 3, 0, 5, 0, 1));

horner_eval(2, list(1, 3, 0, 5, 0, 1));

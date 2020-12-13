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

head(tail(pair(1, pair(3, 2))));

// expected: 3

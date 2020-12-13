// chapter=3 variant=concurrent 
function make_mutex() {
    const cell = list(false);
    function the_mutex(m) {
        return m === "acquire"
               ? test_and_set(cell)
                 ? the_mutex("acquire") // retry
                 : true
               : m === "release"
               ? clear(cell)
               : error(m, "Unknown request -- mutex");
    }
    return the_mutex;
}
function clear(cell) {
    set_head(cell, false);
}
function make_serializer() {
    const mutex = make_mutex();
    return f => {
               function serialized_f(...args) {
                   mutex("acquire");
                   const val = f(...args);
                   mutex("release");
                   return val;
               }
               return serialized_f;          
           };
}

// expected: 'all threads terminated'

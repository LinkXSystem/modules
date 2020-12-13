function stream_enumerate_interval(low, high) {
    return low > high
           ? null
           : pair(low,
                  () => stream_enumerate_interval(low + 1, 
                                                  high)); 
}
let x = stream_map(display, stream_enumerate_interval(0, 10));

stream_ref(x, 5);

stream_ref(x, 7);

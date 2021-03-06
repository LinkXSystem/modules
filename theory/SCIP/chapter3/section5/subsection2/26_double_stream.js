function scale_stream(stream, factor) {
    return stream_map(x => x * factor,
                      stream);
}
const double = pair(1, () => scale_stream(double, 2));

stream_ref(double, 50);

// expected: 1125899906842624

process_query('assert(supervisor(list("Julius", "Caesar"), list("Julius", "Caesar")))', "silent");
first_answer('supervisor(x, x)');

// expected: "supervisor(list('Julius', 'Caesar'), list('Julius', 'Caesar'))"

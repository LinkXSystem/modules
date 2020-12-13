function literal_value(component) {    
    return head(tail(component));
}

literal_value(parse("null;"));

// expected: ["literal", null]

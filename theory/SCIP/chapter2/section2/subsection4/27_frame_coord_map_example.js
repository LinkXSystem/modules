const my_origin = make_vect(1, 2);
const my_edge_1 = make_vect(3, 4);
const my_edge_2 = make_vect(5, 6);
const my_frame = make_frame(my_origin, my_edge_1, my_edge_2);
const my_coord_map = frame_coord_map(my_frame);
const my_vector = make_vect(1, 2);
const my_mapped_vector = my_coord_map(my_vector);
my_mapped_vector;

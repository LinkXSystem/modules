function make_vect(x, y) {
    return pair(x, y);
}
function xcor_vect(vector) {
    return head(vector);
}
function ycor_vect(vector) {
    return tail(vector);
}
function scale_vect(factor, vector) {
    return make_vect(factor * xcor_vect(vector), 
                     factor * ycor_vect(vector));
}
function add_vect(vector1, vector2) {
    return make_vect(xcor_vect(vector1)  
                     + xcor_vect(vector2), 
                     ycor_vect(vector1)  
                     + ycor_vect(vector2));
}
function sub_vect(vector1, vector2) {
    return make_vect(xcor_vect(vector1)  
                     - xcor_vect(vector2), 
                     ycor_vect(vector1)  
                     - ycor_vect(vector2));
}
function make_frame(origin, edge1, edge2) {
    return list(origin, edge1, edge2);
}
function origin_frame(frame) {
    return list_ref(frame, 0);
}
function edge1_frame(frame) {
    return list_ref(frame, 1);
}
function edge2_frame(frame) {
    return list_ref(frame, 2);
}
const unit_origin = make_vect(0, 0);
const unit_edge_1 = make_vect(1, 0);
const unit_edge_2 = make_vect(0, 1);
const unit_frame = make_frame(unit_origin, 
                              unit_edge_1,
                              unit_edge_2);
outline_painter(unit_frame);

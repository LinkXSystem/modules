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
function frame_coord_map(frame) {
    return v => add_vect(origin_frame(frame), 
                         add_vect(scale_vect(xcor_vect(v), 
                                             edge1_frame(frame)), 
                                  scale_vect(ycor_vect(v), 
                                             edge2_frame(frame))));
}
function transform_painter(painter, origin,
                           corner1, corner2) {
    return frame => {
             const m = frame_coord_map(frame);
             const new_origin = m(origin);
             return painter(make_frame(
                              new_origin, 
                              sub_vect(m(corner1), 
                                       new_origin), 
                              sub_vect(m(corner2), 
                                       new_origin)));
           };
}
const unit_origin = make_vect(0, 0);
const unit_edge_1 = make_vect(1, 0);
const unit_edge_2 = make_vect(0, 1);
const unit_frame = make_frame(unit_origin, 
                              unit_edge_1,
                              unit_edge_2);
function make_segment(v_start, v_end) {
    return pair(v_start, v_end);
}
function start_segment(v) {
    return head(v);
}
function end_segment(v) {
    return tail(v);
}
// "drawing a line" here simulated
// by printing the coordinates of
// the start and end of the line
function draw_line(v_start, v_end) {
    display("line starting at");
    display(v_start);
    display("line ending at");
    display(v_end);
}
function segments_to_painter(segment_list) {
    return frame => 
               for_each(segment => 
                            draw_line(frame_coord_map(frame)
                                      (start_segment(segment)), 
                                      frame_coord_map(frame)
                                      (end_segment(segment))), 
                        segment_list);
}
const x_start_1 = make_vect(0, 0);
const x_end_1 = make_vect(1, 1);
const x_segment_1 = make_segment(x_start_1, 
                                 x_end_1);
const x_start_2 = make_vect(1, 0);
const x_end_2 = make_vect(0, 1);
const x_segment_2 = make_segment(x_start_2, 
                                 x_end_2);
const x_painter = segments_to_painter(
                              list(x_segment_1, 
                                   x_segment_2));
x_painter(unit_frame);
function rotate180(painter) {
    return transform_painter(
               painter, 
               make_vect(1, 1),  // new origin
               make_vect(0, 1),  // new end of edge1
               make_vect(1, 0)); // new end of edge2
}

rotate180(x_painter)(unit_frame);

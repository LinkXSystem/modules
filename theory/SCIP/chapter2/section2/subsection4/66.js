function beside(painter1, painter2) {
    const split_point = make_vect(0.5, 0);
    const paint_left = transform_painter(painter1, 
                            make_vect(0, 0), 
                            split_point, 
                            make_vect(0, 1));
    const paint_right = transform_painter(painter2, 
                            split_point, 
                            make_vect(1, 0), 
                            make_vect(0.5, 1));
    return frame => {
               paint_left(frame);
               paint_right(frame);
           };
}
function rotate90(painter) {
    return transform_painter(painter, 
                             make_vect(1, 0), 
                             make_vect(1, 1), 
                             make_vect(0, 0));
}
function rotate270(painter) {
    return transform_painter(
               painter, 
               make_vect(0, 1),  // new origin
               make_vect(0, 0),  // new end of edge1
               make_vect(1, 0)); // new end of edge2
}
function below(painter1, painter2) {
    return rotate270(beside(rotate90(painter1),
                            rotate90(painter2)));
}

below(x_painter, x_painter)(unit_frame);

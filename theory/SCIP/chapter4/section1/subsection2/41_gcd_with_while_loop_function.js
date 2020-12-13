// while_loop to be written by students
function gcd(a, b) {
    while_loop( () => a !== b,
                () => {  if (a > b) {
                             a = a - b;
                         } else {
                             b = b - a;
                         }
                      }
              );
    return a;
}

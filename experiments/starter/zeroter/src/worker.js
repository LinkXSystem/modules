const zmq = require('zeromq');
const sock = zmq.socket('pull');

sock.connect('tcp://localhost:3000');
console.log('Worker connected to port 3000');

sock.on('message', function (msg) {
    console.log('work: %s', msg.toString());
});
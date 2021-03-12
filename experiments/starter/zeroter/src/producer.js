// 版本文档：https://www.npmjs.com/package/zeromq/v/5.2.0

const zmq = require('zeromq');

const sock = zmq.socket('push');
sock.bindSync('tcp://*:3000');

const IntervalTime = 500;

console.log('Producer bound to port 3000');

setInterval(function () {
    sock.send('some work');
}, IntervalTime);

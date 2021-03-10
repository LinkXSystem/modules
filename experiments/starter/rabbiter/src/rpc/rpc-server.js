const Amqp = require('amqplib/callback_api');

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.prefetch(1);

        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            const n = Number.parseInt(msg.content.toString(), 10);

            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
            });

            channel.ack(msg);
        });
    });
});

function fibonacci(n) {
    if(n == 0 || n == 1) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}
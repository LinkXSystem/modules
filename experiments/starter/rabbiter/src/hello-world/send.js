const Amqp = require('amqplib/callback_api');

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const queue = 'hello';
        const message = 'Hello World !';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(message));

        console.warn("[x] Sent %s", message);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
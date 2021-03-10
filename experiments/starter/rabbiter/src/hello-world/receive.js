const Amqp = require('amqplib/callback_api');

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    const uuid = Math.random() * 100;

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(message) {
            console.log(" [UUID] %s", uuid);
            console.log(" [x] Received %s", message.content.toString());
        }, {
            noAck: true
        });
    });
});

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    const uuid = Math.random() * 100;

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(message) {
            console.log(" [UUID] %s", uuid);
            console.log(" [x] Received %s", message.content.toString());
        }, {
            noAck: true
        });
    });
});
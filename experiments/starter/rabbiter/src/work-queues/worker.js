const Amqp = require('amqplib/callback_api');

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(message) {
            const secs = message.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", message.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
                // Ack 解决积压的问题
                channel.ack(message);
            }, secs * 1000);

        }, {
            // manual acknowledgment mode,
            // see https://www.rabbitmq.com/confirms.html for details
            noAck: false
        });
    });
});
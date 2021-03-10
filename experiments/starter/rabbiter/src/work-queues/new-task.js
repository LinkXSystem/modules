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
        const message = process.argv.slice(2).join(' ') || "Hello World!";

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: true
        });

        console.log(" [x] Sent '%s'", message);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 500);
});
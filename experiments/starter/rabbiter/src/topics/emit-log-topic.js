const Amqp = require('amqplib/callback_api');

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const message = args.slice(1).join(' ') || 'Hello World!';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.publish(exchange, key, Buffer.from(message));
        console.log(" [x] Sent %s:'%s'", key, message);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 500);
});
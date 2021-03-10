const Amqp = require('amqplib/callback_api');

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const exchange = 'direct_logs';
        const args = process.argv.slice(2);
        const message = args.slice(1).join(' ') || 'Hello World!';
        const severity = (args.length > 0) ? args[0] : 'info';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        channel.publish(exchange, severity, Buffer.from(message));
        console.log(" [x] Sent %s: '%s'", severity, message);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 500);
});
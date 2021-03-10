const Amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if(args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

Amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }

    connection.createChannel(function(err, channel) {
        if(err) {
            throw err;
        }

        const exchange = 'direct_logs';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if(error2) {
                throw error2;
            }

            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(severity) {
                channel.bindQueue(q.queue, exchange, severity);
            });

            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});
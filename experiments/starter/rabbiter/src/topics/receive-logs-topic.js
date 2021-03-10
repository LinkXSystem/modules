const Amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if(args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
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

        const exchange = 'topic_logs';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if(error2) {
                throw error2;
            }

            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(key) {
                channel.bindQueue(q.queue, exchange, key);
            });

            channel.consume(q.queue, function(message) {
                console.log(" [x] %s:'%s'", message.fields.routingKey, message.content.toString());
            }, {
                noAck: true
            });
        });
    });
});
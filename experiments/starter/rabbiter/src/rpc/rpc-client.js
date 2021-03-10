const Amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if(args.length == 0) {
    console.log("Usage: rpc_client.js num");
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

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if(error2) {
                throw error2;
            }

            const correlationId = generateUuid();
            const num = Number.parseInt(args[0], 10);

            console.log(' [x] Requesting fib(%d)', num);

            channel.consume(q.queue, function(message) {
                if(message.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', message.content.toString());

                    setTimeout(function() {
                        connection.close();
                        process.exit(0)
                    }, 500);
                }
            }, {
                noAck: true
            });

            channel.sendToQueue('rpc_queue',
                Buffer.from(num.toString()), {
                correlationId: correlationId,
                replyTo: q.queue
            });
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
const amqp = require('amqplib')

class Producer {
    conn;
    uri_res = 'amqp://localhost';

    constructor () {
        this.conn = amqp.connect(this.uri_res);
    }

    async send(q, data) {
        let amconn  = await this.conn;
        let ch      = await amconn.createChannel();
        //var q       = 'stats';
        return ch.assertQueue(q).then((ok) => {
            return ch.sendToQueue(q, Buffer.from(data));
        });
    }
}

module.exports =  new Producer()
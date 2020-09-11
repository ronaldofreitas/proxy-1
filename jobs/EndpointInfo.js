const MongoClientClass = require('../data/MongoInstance')
const db_client = "cliente_x";
const url = require('url');

module.exports = {
    key: 'EndpointInfo',
    options: {
        //delay: 2000,
    },
    async handle({ data }) {
        await MongoClientClass.init(db_client);
        const endpoint = url.parse(data.url_path).pathname;
        const insrt_data = {
            time_start: data.time_start,
            time_end: data.time_end,
            status_code: data.status_code,
            request_method: data.request_method
        }
        try {
            const collec = MongoClientClass.db.collection('endpoint'+endpoint)
            collec.insertOne(insrt_data, (error, response) => {
                if (error) throw error;
                //console.log('inserted record', response.ops[0]);
                console.log('inserted record \n');
                //client.close();
            });            
        } catch (e) {
            console.log(e)
        }
    }
}

/*
var proxy_temp_stats = {
    "/teste" : {
        time_start: 123456789,
        time_end: 123456789,
        status_code: 200,
        request_method: "GET"
    }
}

var proxy_stats = {
    endpoint: "/teste",
    method: "GET",
    max_latency: 1.54,
    min_latency: 0.85,
    average_latency: 0.91,
    total_requests: 1574
}
*/


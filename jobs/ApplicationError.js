const MongoClientClass = require('../data/MongoInstance')
const db_client = "cliente_x_endpoint";
const url = require('url');

module.exports = {
    key: 'ApplicationError',
    options: {
        //delay: 2000,
    },
    async handle({ data }) {
        await MongoClientClass.init(db_client);
        const endpoint = url.parse(data.url_path).pathname;
        const insrt_data = {
            ts: data.time_start,
            te: data.time_end,
            sc: data.status_code,
            rm: data.request_method,
            em: data.error_message,
            ec: data.error_code
        }
        const pathResource = endpoint.substring(1) == '' ? '_' : endpoint.substring(1)
        try {
            const collec = MongoClientClass.db.collection('erro-'+pathResource)
            collec.insertOne(insrt_data, (error, response) => {
                if (error) throw error;
                //console.log('inserted erro_app', response.ops[0]);
                console.log('inserted erro_app \n');
                //client.close();
            });            
        } catch (e) {
            console.log(e)
        }
    }
}

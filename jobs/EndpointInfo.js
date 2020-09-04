const MongoClient = require('mongodb').MongoClient;
const urlMongo = 'mongodb://localhost:27017';
const dbName = 'pip2be';

module.exports = {
    key: 'EndpointInfo',
    options: {
        delay: 2000,
    },
    async handle({ data }) {
        const endpoint = Object.keys(data)[0];

        MongoClient.connect(urlMongo, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(err)
                throw new Error('algum erro no mongo')
            }
            
            console.log("MongoClient connected");
            const db = client.db(dbName);
            
            db.collection('endpoint_info'+endpoint).insertOne(data[endpoint], (error, response) => {
                if(error) {
                    console.log('Error occurred while inserting');
                    console.log(error)
                    // return 
                } else {
                    console.log('inserted record', response.ops[0]);
                    //client.close();
                }
            });
        });
    }
};
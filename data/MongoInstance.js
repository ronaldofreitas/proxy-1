const { MongoClient } = require('mongodb');

class MongoClientClass {
    constructor() {
        const url = 'mongodb://localhost:27017';
        const mongo_options = {
            useUnifiedTopology: true,
            keepAlive: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000
        };
        this.client = new MongoClient(url, mongo_options);
    }
    async init(dbName) {
        await this.client.connect();
        console.log('connected',dbName);
        this.db = this.client.db(dbName);
    }
}
module.exports = new MongoClientClass();
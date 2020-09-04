var Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('work', REDIS_URL);

const MongoClient = require('mongodb').MongoClient;
const urlMongo = 'mongodb://localhost:27017';
const dbName = 'pip2be';

let maxJobsPerWorker = 50;

workQueue.process(job => {
    console.log('fila iniciada')
    console.log(job.data)
    //return await sendMail(job.data.email); 

    MongoClient.connect(urlMongo, { useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err)
            throw new Error('algum erro no mongo')
        }
        
        console.log("MongoClient connected");
        const db = client.db(dbName);
    
        /*
        db.collection('endpoint_info'+endpoint).insertOne(job.data, (error, response) => {
            if(error) {
                console.log('Error occurred while inserting');
                console.log(error)
                // return 
            } else {
                console.log('inserted record', response.ops[0]);
                // return 
            }
        });
        */
    
        //client.close();
    });
})

workQueue.process('teste',async (job) => {
    console.log('fila iniciada')
    console.log(job.data)
    //return await sendMail(job.data.email); 

    MongoClient.connect(urlMongo, { useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err)
            throw new Error('algum erro no mongo')
        }
        
        console.log("MongoClient connected");
        const db = client.db(dbName);
    
        // mongo
    });

    /*
    job.on('completed', (job, result) => {
        console.log(`Job completed with result ${result}`);
    });
    job.on('failed', (job, err) => {
        console.log('Job failed', queue.key, job.data);
        console.log(err);
    });
    */
});


module.exports = {workQueue};
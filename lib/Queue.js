var Queue = require('bull');
//import Queue from 'bull';

//import redisConfig from '../../config/redis';
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
//let workQueue = new Queue('work', REDIS_URL);

//import * as jobs from '../jobs';
const jobs = require('../jobs/index');

const { setQueues, UI } = require('bull-board')
const express = require('express')
const app = express()
app.use('/admin/queues', UI)
const port_ui = 5000;
app.listen(port_ui, () => {
    console.log(`Example app listening at http://localhost:${port_ui}`)
});

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, REDIS_URL),
    name: job.key,
    handle: job.handle,
    options: job.options,
}));

module.exports = {
  queues,
  add(name, data) {
    const queue = this.queues.find(queue => queue.name === name);
    setQueues([queue.bull])
    return queue.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach(queue => {
        queue.bull.process(queue.handle);

        queue.bull.on('failed', (job, err) => {
            console.log('Job failed', queue.key, job.data);
            console.log(err);
        });
        
        queue.bull.on('completed', (job, result) => {
            console.log(`Job completed with result ${result}`);
            //console.log(job);
        });

    })
  }
};
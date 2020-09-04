/*
ab -n 1000 -c 10 http://localhost:8000/teste

ab -n 1000 -c 10 http://localhost:3001/teste

docker run -p 27017:27017 -e AUTH=no tutum/mongodb
docker run -p 6379:6379 redis
*/

/*
const MongoClient = require('mongodb').MongoClient;
const urlMongo = 'mongodb://localhost:27017';
const dbName = 'pip2be';
*/

var fastDate = require('fast-date')({format: 'unix'})
const httpProxy = require('http-proxy');
const opts = {
    target: {
        host: 'localhost',
        port: 3001
    }
};

const stringify = require('fast-stringify');
const statusCode = require('./status-code');
const url = require('url');
var EventEmitter = require('eventemitter3');
class MyEmitter extends EventEmitter {};

const myEmitter = new MyEmitter();
myEmitter.on('e_request', () => {
    console.log('evento REQUEST');
});

function status_code(code) {
    return statusCode[code] != undefined ? statusCode[code] : {
        message: 'Erro Desconhecido',
        description: ' -- '
    }
}

function latency(t2,t1) {
    return (t2-t1);
}

var t1;
var cont=1;


const Queue = require('./lib/Queue');
Queue.process();

const options_que = {
    delay: 3000,
    attempts: 1
};

const proxy = httpProxy.createProxyServer(opts).listen(8000);
var reqMethod;
proxy.on('proxyReq', (proxyReq, req, res) => {

    reqMethod = proxyReq.method;
    //console.log(proxyReq.method)
    //console.log(' ************************************************************** ')
    //console.log(req)

    //var proto = req.connection.encrypted ? 'https' : 'http';
    //console.log(proto);

    t1 = new Date();
    //console.log(proxyReq.agent.protocol)
    //console.log(proxyReq.agent.sockets)
    //console.log(req.headers)

    const url_info = url.parse(req.url,true);
    //console.log(url_info);

    //var endpoint = req.url;
    var host = req.headers.host;
    //console.log(host, host_allow, req.url)

    //myEmitter.emit('e_request');
    console.log( cont );
    cont++
})
.on('proxyRes', async (proxyRes, req, res) => {

    //console.log(proxyRes.agent.sockets)

    const url_info = url.parse(req.url,true);
    var endpoint = url_info.pathname;
    var t2 = new Date();// fastDate()
    var info_response = {
        date: fastDate(),
        latency_ms: latency(t2, t1),
        status_code: proxyRes.statusCode,
        //message: status_code(proxyRes.statusCode),
        query_parameters: url_info.search,
        reqMethod
    };
    const infend = {}
    infend[endpoint] = info_response;

    //let job = workQueue.add(endpoint, infend, options_que);
    
    await Queue.add('EndpointInfo', infend);

    //let job = await workQueue.add();

    /*
    db.collection('endpoint_info'+endpoint).insertOne(info_response, (error, response) => {
        if(error) {
            console.log('Error occurred while inserting');
            console.log(error)
            // return 
        } else {
            console.log('inserted record', response.ops[0]);
            // return 
        }
    });

    //client.close();
    */

    //responseInfoEndpoint(rdcli, endpoint_list, endpoint, info_response);

    /*
    if (proxyRes.headers['content-length'] > 50) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify('Limite Tamanho Conteúdo'));
    }
    */

})
.on('error', (err, req, res) => {

    // grava no banco
    // envia notificação: email, push, socket

    console.log('erro',err)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
});


/*
1 - volume de requisições
2 - tempo médio de resposta
3 - período de maior volume
4 - ML para identificar qual endpoint está mais propenso a erros
*/



/*
var events = require('events');
var eventEmitter = new events.EventEmitter();

// listener #1
var listner1 = function listner1() {
   console.log('listner1 executed.');
}

// listener #2
var listner2 = function listner2() {
   console.log('listner2 executed.');
}

// Bind the connection event with the listner1 function
eventEmitter.addListener('connection', listner1);

// Bind the connection event with the listner2 function
eventEmitter.on('connection', listner2);

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + " Listner(s) listening to connection event");

// Fire the connection event 
eventEmitter.emit('connection');

// Remove the binding of listner1 function
eventEmitter.removeListener('connection', listner1);
console.log("Listner1 will not listen now.");

// Fire the connection event 
eventEmitter.emit('connection');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + " Listner(s) listening to connection event");

console.log("Program Ended.");
*/
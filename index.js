const httpProxy = require('http-proxy');
const opts = {
    target: {
        host: '127.0.0.1',
        port: 3001
    }
};
const proxy = httpProxy.createProxyServer(opts).listen(8000);
const statusCode = require('./status-code');

const EventEmitter = require('events');
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

function requestSumEndpoint() {

}

var t1;

var endpoint_list = [
    '/',
    '/teste',
];

var endpoints = {};
endpoints['/']      = 0;
endpoints['/teste'] = 0;
endpoints['/abc']   = 0;

proxy.on('proxyReq', (proxyReq, req, res) => {
    t1 = new Date();

    var endpoint = req.url;
    var host = req.headers.host;
    //console.log(host, endpoint);
    console.log(endpoints);
    if (endpoints[endpoint]) {
        endpoints[endpoint] = (endpoints[endpoint] + 1);
    } else {
        endpoints[endpoint] = 1;
    }
    
    //myEmitter.emit('e_request');
})
.on('proxyRes', (proxyRes, req, res) => {

    //console.log( status_code(proxyRes.statusCode) )

    /*
    if (proxyRes.headers['content-length'] > 50) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify('Limite Tamanho Conteúdo'));
    }
    */
    
    //var t2 = new Date();
    //console.log( latency(t2, t1) );
})
.on('error', function (err, req, res) {

    // grava no banco
    // envia notificação: email, push, socket

    console.log('erro')
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
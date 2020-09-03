const httpProxy = require('http-proxy');
const opts = {
    target: {
        host: '127.0.0.1',
        port: 3001
    }
};
const proxy = httpProxy.createProxyServer(opts).listen(8000);
const statusCode = require('./status-code');
const url = require('url');
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
    let lt = (t2-t1)
    return lt+' ms';
}

var count_endpoints = {};
function responseInfoEndpoint(endpointsList, endpoint, info) {
    var endp_exist = endpointsList.includes(endpoint);
    if (endp_exist) {
        if (count_endpoints[endpoint] != undefined) {
            count_endpoints[endpoint].push(info)
        } else {
            count_endpoints[endpoint] = [info];
        }
        console.log(count_endpoints)
    } else {
        console.log('ENDPOINT NÃO CADASTRADO')
    }
}


var t1;

var endpoint_list = [
    '/',
    '/teste',
    '/abc',
];
/*
endpoint
    data
    latencia
    statusCode
    response
    parametros
*/

proxy.on('proxyReq', (proxyReq, req, res) => {
    
    t1 = new Date();

    //const queryObject = url.parse(req.url,true).query;
    //console.log(queryObject);

    //var endpoint = req.url;
    //var host = req.headers.host;
    //requestInfoEndpoint(endpoint_list, endpoint.toString());
    //console.log(host, endpoint);


    //myEmitter.emit('e_request');
})
.on('proxyRes', (proxyRes, req, res) => {
    var endpoint = req.url;
    var t2 = new Date();
    var info_response = {
        date: new Date(),
        latency: latency(t2, t1),
        status_code: proxyRes.statusCode,
        message: status_code(proxyRes.statusCode),
    }
    responseInfoEndpoint(endpoint_list, endpoint, info_response);

    //console.log( status_code(proxyRes.statusCode) )

    /*
    if (proxyRes.headers['content-length'] > 50) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify('Limite Tamanho Conteúdo'));
    }
    */
    
    
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
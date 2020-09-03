var redis = require("redis");
var rdcli = redis.createClient();
var fastDate = require('fast-date')({format: 'unix'})
const httpProxy = require('http-proxy');
const opts = {
    target: {
        host: 'localhost',
        port: 3001
    }
};


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

var count_endpoints = {};
function responseInfoEndpoint(endpointsList, endpoint, info) {
    var endp_exist = endpointsList.includes(endpoint);
    if (endp_exist) {
        if (count_endpoints[endpoint] != undefined) {
            count_endpoints[endpoint].push(info)
        } else {
            count_endpoints[endpoint] = [info];
        }
        //console.log(count_endpoints)
        //console.log(JSON.stringify(count_endpoints, null, 2))
    } else {
        //console.log('ENDPOINT NÃO CADASTRADO')
    }
}

var t1;
var host_allow = 'http://localhost:8000'
var endpoint_list = [
    '/',
    '/teste',
    '/abc',
];

var cont=1;
rdcli.on("connect", () => {
    
    console.log("redis connected");

    const proxy = httpProxy.createProxyServer(opts).listen(8000);
    var reqMethod;
    proxy.on('proxyReq', (proxyReq, req, res) => {

        proxyReq.on('error', function(err) {
            console.log('(1) A', err)
            if (err.code === "ECONNRESET") {
                console.log("Timeout occurs");
                return;
            }
            //handle normal errors
        })
        .on('connect', () => {
            console.log('(1) connect')
        })
        .on('ready', () => {
            console.log('(1) ready')
        })
        .on('data', (data) => {
            console.log('(1) data')
        })
        .on('close', () => {
            console.log('(1) close')
        })
        .on('end', () => {
            console.log('(1) end')
        })
        .on('timeout', () => {
            console.log('(1) timeout')
        });

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
    .on('proxyRes', (proxyRes, req, res) => {
        
        proxyRes.on('error', function(err) {
            console.log('(2) A', err)
            if (err.code === "ECONNRESET") {
                console.log("Timeout occurs");
                return;
            }
        })
        .on('connect', () => {
            console.log('(2) connect')
        })
        .on('ready', () => {
            console.log('(2) ready')
        })
        .on('data', (data) => {
            console.log('(2) data')
        })
        .on('close', () => {
            console.log('(2) close')
        })
        .on('end', () => {
            console.log('(2) end')
        })
        .on('timeout', () => {
            console.log('(2) timeout')
        });
        //console.log(proxyRes.agent.sockets)
        
        /*
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
        }
        responseInfoEndpoint(endpoint_list, endpoint, info_response);
        
        var msgg = JSON.stringify(info_response);
        rdcli.rpush([`client_date`, msgg], (err) => {
            if (err){
                console.log('Ooops!');
            }
        });
        */

        /*
        if (proxyRes.headers['content-length'] > 50) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify('Limite Tamanho Conteúdo'));
        }
        */
 
        //console.log( latency(t2, t1) );
        
        //res.end()
    })
    .on('error', function (err, req, res) {

        // grava no banco
        // envia notificação: email, push, socket

        console.log('erro',err)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(err));
    });
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
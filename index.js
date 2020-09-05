/*
ab -n 1000 -c 10 http://localhost:8000/teste

ab -n 1000 -c 10 http://localhost:3001/teste

docker run -p 27017:27017 -e AUTH=no tutum/mongodb
docker run -p 6379:6379 redis
*/

const httpProxy = require('http-proxy');
const opts = {
    target: {
        host: 'localhost',
        port: 3001
    }
};

const url = require('url');

/*
const EventEmitter = require('eventemitter3');
class MyEmitter extends EventEmitter {};

const myEmitter = new MyEmitter();
myEmitter.on('e_request', () => {
    console.log('evento REQUEST');
});

const statusCode = require('./status-code');
function status_code(code) {
    return statusCode[code] != undefined ? statusCode[code] : {
        message: 'Erro Desconhecido',
        description: ' -- '
    }
}
status_code('200');
function latency(t2,t1) {
    return (t2-t1);
}
*/
var t1;

const Queue = require('./lib/Queue');
Queue.process();

const proxy = httpProxy.createProxyServer(opts).listen(8000);
var reqMethod, protocol;
//proxy.on('proxyReq', (proxyReq, req, res) => {
proxy.on('proxyReq', (proxyReq, req, _) => {

    reqMethod = proxyReq.method;
    t1 = Date.now();
    protocol = proxyReq.agent.protocol;

    //console.log(proxyReq.agent.sockets)

    //const url_info = url.parse(req.url,true);
    //console.log(url_info);

    //var endpoint = req.url;
    //var host = req.headers.host;
    //console.log(host, host_allow, req.url)

    //myEmitter.emit('e_request');
})
.on('proxyRes', async (proxyRes, req, res) => {

    const url_info = url.parse(req.url,true);
    var endpoint = url_info.pathname;
    var info_response = {
        time_start: t1,
        time_end: Date.now(),
        status_code: proxyRes.statusCode,
        query_parameters: url_info.search,
        reqMethod,
        protocol
    };
    const infend = {};
    infend[endpoint] = info_response;
    console.log(infend)

    //await Queue.add('EndpointInfo', infend);
})
.on('error', (err, req, res) => {
    const url_info = url.parse(req.url,true);
    var endpoint = url_info.pathname;
    var info_response = {
        time_start: t1,
        time_end: Date.now(),
        query_parameters: url_info.search,
        reqMethod,
        error: err,
        protocol
    };
    const infend = {};
    infend[endpoint] = info_response;
    //console.log(infend)

    // grava no banco
    // envia notificação: email, push, socket

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        message: "servidor indisponível"
    }));
    //res.json(info_response).end();
});

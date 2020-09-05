/*
ab -n 1000 -c 10 http://localhost:8000/teste

ab -n 1000 -c 10 http://localhost:3001/teste

docker run -p 27017:27017 -e AUTH=no tutum/mongodb
docker run -p 6379:6379 redis
*/
'use strict';

const httpProxy = require('http-proxy');
const opts_proxy = {
    target: {
        host: 'localhost',
        port: 3001
    },
    //proxyTimeout: 500,
    //timeout: 500
};
const proxy_port = 8000;
const url = require('url');
const Monitor = require('ping-monitor');

/*





    NÃO É NECESSÁRIO COMPaRAR O HOST NEM CONFERIR A LISTA DE ENDPOINTS
    APOSTA MESMO É EM UM BASIC AUTH BEM FEITO E SEGURO


    


*/

const MongoClientClass = require('./data/MongoInstance');
const Queue = require('./lib/Queue');
const myMonitor = new Monitor({
    address: 'localhost',
    port: 3001,
    id:123,
    title: 'tag_client_xx',
    interval: 0.1 // 1 = em minutos, 0.5 = 30 segundos
});

var t1=0;
async function start(opts) {
    console.log('SERVIÇO INICIADO')
    await MongoClientClass.init(opts.dbName);
    Queue.process();

    const proxy = httpProxy.createProxyServer(opts_proxy).listen(proxy_port);
    proxy
    .on('proxyReq', (proxyReq, req, _) => {
        t1 = Date.now();
    })
    .on('proxyRes', (proxyRes, req, _) => {
        const url_info = url.parse(req.url,true);
        var info_response = {
            time_start: t1,
            time_end: Date.now(),
            status_code: proxyRes.statusCode,
            query_parameters: url_info.search,
            request_method: req.method
        };
        const infend = {};
        infend[url_info.pathname ? url_info.pathname : '/'] = info_response;
        Queue.add('EndpointInfo', infend);
    })
    .on('error', (err, req, res) => {
        //https://nodejs.org/api/errors.html#errors_common_system_errors
        const url_info = url.parse(req.url,true);
        var info_response = {
            time_start: t1,
            time_end: Date.now(),
            query_parameters: url_info.search,
            request_method: req.method,
            error_message: err.toString(),
            error_code: err.code,
        };
        const infoerror = {};
        infoerror[url_info.pathname ? url_info.pathname : '/'] = info_response;
        //console.log(infoerror)

        // grava no banco
        // envia notificação: email, push, socket

        //myEmitter.emit('e_request');
        //await Queue.add('EndpointInfo', infend);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            message: "Unavailable Server"
        }));
    });
};

myMonitor.once('up', (res, state) => {
    start({
        dbName: state.title
    }).then(ret => {
        console.log(ret)
    }).catch(e => {
        console.log(e)
    });
    console.log(state)
    console.log('PING OK');
});

myMonitor.on('up', (res, state) => {
    //console.log(state)
    console.log('Yay!! ' + res.address + ':' + res.port + ' is up.');
});

myMonitor.on('down', (res, state) => {
    console.log(state)
    console.log('Oh Snap!! ' + res.address + ':' + res.port + ' is down! ');
});

myMonitor.on('stop', (res, state) => {
    console.log(state)
    console.log(res.address + ' monitor has stopped.');
});

myMonitor.on('error', (error, res) => {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXX ERROR SERVER XXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log(res);
    console.log(error);
});

myMonitor.on('timeout', (error, res) => {
    console.log(res);
    console.log(error);
});
/*
ab -n 1000 -c 10 http://localhost:8000/teste

ab -n 1000 -c 10 http://localhost:3001/teste

docker run -p 27017:27017 -e AUTH=no tutum/mongodb
docker run -p 6379:6379 redis
*/
'use strict';

const httpProxy = require('http-proxy');

/*





    NÃO É NECESSÁRIO COMPaRAR O HOST NEM CONFERIR A LISTA DE ENDPOINTS
    APOSTA MESMO É EM UM BASIC AUTH BEM FEITO E SEGURO


    DEIXAR ESSA PARTE COM JS PURO, SEM TYPESCRIPT


    DEIXA O TYPESCRIPT APENAS NA API REST



    


*/

const MongoClientClass = require('./data/MongoInstance');
const Queue = require('./lib/Queue');
//const execFile = require('child_process').execFile;
//const exec = require('child_process').exec;

var t1=0;
const start = async (opts) => {
    
    await MongoClientClass.init(opts.client_db);
    Queue.process();

    const proxy = httpProxy.createProxyServer(opts.proxy.config).listen(opts.proxy.port);
    proxy
    .on('proxyReq', () => { t1 = Date.now(); })
    .on('proxyRes', (proxyRes, req, _) => {
        var info_response = {
            time_start: t1,
            time_end: Date.now(),
            status_code: proxyRes.statusCode,
            request_method: req.method
        };
        const infend = {};
        infend[req.url] = info_response;
        Queue.add('EndpointInfo', infend);
    })
    .on('error', (err, req, res) => {
        var info_response = {
            time_start: t1,
            time_end: Date.now(),
            request_method: req.method,
            error_message: err.toString(),
            error_code: err.code,
        };
        const infoerror = {};
        infoerror[req.url] = info_response;
        console.log(infoerror)

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

var host_server = "localhost", port_server = 3001, id_server = 123;
start({
    client_db: "db_client_2",
    proxy: {
        config: {
            target: {
                host: host_server,
                port: port_server
            },
            //proxyTimeout: 1,
            //timeout: 500
        },
        port: 8000
    }
}).then(() => {
    console.log('SERVIÇO INICIADO')
}).catch(e => {
    console.log('start.catch',e)
});

/*
execFile('node', ['./services/PingService.js', host_server, port_server], (err, stdout, stderr) => {
    console.log(err)
    if (err) throw err;

    console.log(stdout, stderr);
});
*/

const { spawn } = require('child_process');
spawn(`nohup node ./services/PingService.js ${host_server} ${port_server} > ping-out.log &`, [], { detached:true, shell: true }).unref();
//spawn(`node ./services/PingService.js`, [host_server, port_server], { detached:true, shell: true }).unref()

/*
exec(`nohup node services/PingService.js ${host_server} ${port_server} > ping-out.log &`, (e, stdout, stderr) => {
    if (e instanceof Error) {
        console.error(e);
        throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
});
*/


/*
myMonitor.on('up', (res, state) => {
    console.log('PING.ON.UP')
    console.log('servidor ativo');
});

myMonitor.on('down', (res, state) => {
    console.log('PING.DOWN')
    //console.log(state)
    //console.log('Oh Snap!! ' + res.address + ':' + res.port + ' is down! ');
});

myMonitor.on('stop', (res, state) => {
    console.log('PING.STOP')
    //console.log(state)
    //console.log(res.address + ' monitor has stopped.');
});

myMonitor.on('error', (error, res) => {
    console.log('PING.ERROR')
    console.log(res);
    //console.log(error);
});

myMonitor.on('timeout', (error, res) => {
    console.log('PING.TIMEOUT')
    //console.log(res);
    //console.log(error);
});
*/
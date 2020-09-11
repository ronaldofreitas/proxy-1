/*
ab -n 1000 -c 10 http://localhost:8000/teste

ab -n 1000 -c 10 http://localhost:3001/teste

docker run -p 27017:27017 -e AUTH=no tutum/mongodb
docker run -p 6379:6379 redis
*/

'use strict';


/*

    NÃO É NECESSÁRIO COMPaRAR O HOST NEM CONFERIR A LISTA DE ENDPOINTS
    FAZ UM BASIC AUTH BEM FEITO E SEGURO

*/

const 
    httpProxy = require('http-proxy'),
    Queue = require('./lib/Queue'),
    host_server = "localhost",
    port_server = 3001,
    id_server = 123,
    { spawn } = require('child_process'),
    cleanExit = () => {
        console.log('finalizando processo');

        spawn('bash', ['./KILL.sh'], {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit"
        });

        process.exit();
    };
var t1 = 0;

spawn('bash', ['./KILL.sh'], {
  cwd: process.cwd(),
  detached: true,
  stdio: "inherit"
});

process.on('exit', () => {
    console.log('processo finalizado');
})
.on('SIGINT', cleanExit) // catch ctrl-c
.on('SIGTERM', cleanExit); // catch kill

const start = async (opts) => {
    try {
        spawn(`nohup node ./services/PingService.js ${host_server} ${port_server} ${id_server} > ./logs/ping-out.log &`, [], { detached:true, shell: true, stdio: 'ignore' }).unref()
        Queue.process();

        const proxy = httpProxy.createProxyServer(opts.proxy.config).listen(opts.proxy.port);
        proxy
        .on('proxyReq', () => { t1 = Date.now(); })
        .on('proxyRes', (proxyRes, req, _) => {
            let info_endpoint_request = {
                time_start: t1,
                time_end: Date.now(),
                status_code: proxyRes.statusCode,
                request_method: req.method,
                url_path: req.url,
                groups: []
            };
            Queue.add('EndpointInfo', info_endpoint_request);
        })
        .on('error', (err, req, res) => {
            let error_endpoint_app = {
                time_start: t1,
                time_end: Date.now(),
                request_method: req.method,
                url_path: req.url,
                error_message: err.toString(),
                error_code: err.code,
            };
            Queue.add('ApplicationError', error_endpoint_app);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                message: "Unavailable Server"
            }));
        });

    } catch (error) {
        return error
    }
}

start({
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



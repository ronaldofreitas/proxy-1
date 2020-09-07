
console.log('PING SERVICE - INICIADO')
console.log(process.argv)

const monitor_opts = {
    address: process.argv[2],
    port: parseInt(process.argv[3]),
    interval: 0.1 // 1 = em minutos, 0.5 = 30 segundos
};

console.log(monitor_opts)
const Monitor = require('ping-monitor');

try {

    const myMonitor = new Monitor(monitor_opts);

    console.log('PING SERVICE - INICIADO')
    console.log(process.argv)
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
    
    console.log('PING SERVICE - ...')
} catch (error) {
    console.log('erro', error)
}



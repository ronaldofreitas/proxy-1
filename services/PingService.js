const logger = require('pino')()
const monitor_opts = {
    address: process.argv[2],
    port: parseInt(process.argv[3]),
    id: process.argv[4],
    interval: 0.1 // 1 = em minutos, 0.5 = 30 segundos
};
const Monitor = require('ping-monitor');
const myMonitor = new Monitor(monitor_opts);

myMonitor.on('up', (res, state) => {
    var log = {}
    log['PING.UP'] = state
    logger.info(log)
});

myMonitor.on('down', (res, state) => {
    var log = {}
    log['PING.DOWN'] = state
    logger.error(log)
});

myMonitor.on('stop', (res, state) => {
    var log = {}
    log['PING.STOP'] = state
    logger.error(log)
});

myMonitor.on('error', (error, res) => {
    var log = {}
    log['PING.ERROR'] = res
    logger.error(log)
});

myMonitor.on('timeout', (error, res) => {
    var log = {}
    log['PING.TIMEOUT'] = res
    logger.error(log)
});


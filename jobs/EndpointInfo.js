const 
    Producer = require('../services/MQService'),
    stringify = require('fast-json-stable-stringify'),
    url = require('url');

module.exports = {
    key: 'EndpointInfo',
    options: {
        //delay: 2000,
    },
    async handle({ data }) {

        const endpoint      = url.parse(data.url_path).pathname
        const pathResource  = endpoint.substring(1) == '' ? '_' : endpoint.substring(1)

        const insrt_data = {
            ep: pathResource,
            ts: data.time_start,
            te: data.time_end,
            sc: data.status_code,
            rm: data.request_method
        }
        
        await Producer.send( stringify(insrt_data) )
    }
}
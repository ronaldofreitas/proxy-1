var count_endpoints = {};
function responseInfoEndpoint(redisCli, endpointsList, endpoint, info) {
    var endp_exist = endpointsList.includes(endpoint);
    if (endp_exist) {
        if (count_endpoints[endpoint] != undefined) {
            count_endpoints[endpoint].push(info)
        } else {
            count_endpoints[endpoint] = [info];
        }

        var msgg = stringify(count_endpoints);
        redisCli.rpush([`client_id`, msgg], (err) => {
            if (err){
                console.log('Ooops!');
            }
        });

        //console.log(count_endpoints)
        //console.log(JSON.stringify(count_endpoints, null, 2))
    } else {
        //console.log('ENDPOINT NÃO CADASTRADO')
    }
}
var host_allow = 'http://localhost:8000'
var endpoint_list = [
    '/',
    '/teste',
    '/abc',
];
 //responseInfoEndpoint(rdcli, endpoint_list, endpoint, info_response);
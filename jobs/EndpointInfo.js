const MongoClientClass = require('../data/MongoInstance')

module.exports = {
    key: 'EndpointInfo',
    options: {
        //delay: 2000,
    },
    async handle({ data }) {
        const endpoint = Object.keys(data)[0];
        try {

            // faz um agregado, somas.. e grava apenas o resultado

            /*
            load.RULES
                - se atingir XX quantidade de requisições
                - se a latência atingir YY
            */

            /*
inserted record {
  time_start: 1599333451766,
  time_end: 1599333451769,
  status_code: 200,
  query_parameters: null,
  request_method: 'GET',
  _id: 5f53e44b394b0b4af4e1c462
}

- quantidade
*/
            MongoClientClass.db.collection('endpoint'+endpoint).insertOne(data[endpoint], (error, response) => {
                if (error) throw error;
                console.log('inserted record', response.ops[0]);
                //client.close();
            });
        } catch (e) {
            console.log(e)
        }
    }
};

/*
minhas stats: by Redis
stats do usuário: by Mongo
*/
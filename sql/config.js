const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '39.105.130.224',
        user: 'fhes',
        password: 'Fhes2018!',
        database: 'fhes',
        charset: 'utf8mb4'
    }
});

module.exports = knex
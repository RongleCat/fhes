const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '112.74.53.72',
        user: 'caohaoxia',
        password: 'Chx-2341298',
        database: 'fhes',
        charset: 'utf8mb4'
    }
});

module.exports = knex
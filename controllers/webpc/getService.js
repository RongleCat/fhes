const sql = require('../../sql/config')

module.exports = (params) => {
    return sql.select().where({id:1}).from('service').timeout(1000)
}
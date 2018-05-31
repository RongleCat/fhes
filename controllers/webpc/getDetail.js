const sql = require('../../sql/config')

module.exports = (params) => {
    return sql.select().where(params).from('details').timeout(1000)
}
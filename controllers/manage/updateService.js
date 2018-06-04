const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql('service').where({id:1}).update(params).timeout(1000)
}
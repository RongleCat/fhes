const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    delete params.data.id
    await sql('news').where({id:params.id}).update(params.data).timeout(1000)
}
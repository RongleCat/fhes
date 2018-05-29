const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql('download').insert(params).timeout(1000)
}
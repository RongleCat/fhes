const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql('news').insert(params).timeout(1000)
}
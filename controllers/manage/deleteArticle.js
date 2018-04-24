const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql('news').where(params).del().timeout(1000)
}
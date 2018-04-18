const sql = require('../../sql/config')

module.exports = async (rule,callback) => {
    await sql.where(rule).from('admin').timeout(1000).then(res => {
        callback(res)
    })
}
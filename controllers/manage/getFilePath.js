const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql.select().where(params).from('download').timeout(1000).then(res=>{
        callback(res)
    })
}
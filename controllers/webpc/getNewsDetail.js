const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    // console.log(params);
    await sql.select().where(params).from('news').timeout(10000).then(res=>{
        callback(res);
    })
}
const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql.select().where(params.rule).from('news').timeout(1000).limit(params.limit).offset(params.start).then((res) => {
        sql.select().where(params.rule).from('news').then(r => {
            callback({
                data: res,
                count: r.length
            })
        })
    })
}
const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql('news').whereRaw(params.rule).timeout(10000).limit(params.limit).offset(params.start).orderBy('edittime', 'desc').then((res) => {
        sql('news').whereRaw(params.rule).then(r => {
            callback({
                data: res,
                count: r.length
            })
        })
    })
}
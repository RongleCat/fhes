const sql = require('../../sql/config')

module.exports = async (params, callback) => {
    await sql('download').whereRaw(params.rule).timeout(1000).limit(params.limit).offset(params.start).orderBy('id', 'desc').then((res) => {
        sql('download').whereRaw(params.rule).then(r => {
            callback({
                data: res,
                count: r.length
            })
        })
    })
}
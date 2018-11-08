const sql = require('../../sql/config')

module.exports = {
  getList: (params) => {
    if (params) {
      return sql('classlist').limit(params.limit).offset(params.start).timeout(10000)
    } else {
      return sql('classlist').select('*').timeout(10000)
    }
  },
  delete: (params) => {
    return sql('classlist').where(params).del().timeout(10000)
  },
  change: (params) => {
    if (params.id) {
      return sql('classlist').where({
        id: params.id
      }).update(params.data).timeout(10000)
    } else {
      return sql('classlist').insert(params).timeout(1000)
    }
  }
}
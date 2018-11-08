const sql = require('../../sql/config')

module.exports = {
  getList: (params) => {
    if (params) {
      if (params.start) {
        return sql('productdetail').whereRaw(params.rule).limit(params.limit).offset(params.start).orderBy('id', 'desc').timeout(10000)
      } else {
        return sql('productdetail').whereRaw(params.rule).timeout(10000)
      }
    } else {
      return sql('productdetail').select('*').timeout(10000)
    }
  },
  delete: (params) => {
    return sql('productdetail').where(params).del().timeout(10000)
  },
  change: (params) => {
    if (params.id) {
      console.log('修改');
      delete params.data.id
      return sql('productdetail').where({
        id: params.id
      }).update(params.data).timeout(10000)
    } else {
      console.log('新增');
      return sql('productdetail').insert(params).timeout(1000)
    }
  }
}
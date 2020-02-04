const Router = require('koa-router')
const router = new Router({prefix: '/tree'})
const {getList, addnode, updateNode, del} = require('../controllers/tree')
// , updateUser, delete: del

router
  .get('/list', getList) // 获取列表
  .post('/addnode', addnode) // 新增
  .post('/updateNode', updateNode) // 更新
  .delete('/:id', del) // 删除用户
// .post('/:userId', updateUser) // 更新用户信息

module.exports = router

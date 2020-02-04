const Router = require('koa-router')
const router = new Router()
const {login, register} = require('../controllers/user')
const {getTagList, getCategoryList} = require('../controllers/tag')

router
  .get('/tag/list', getTagList) // 获取所有的 tag 列表
  .get('/category/list', getCategoryList) // 获取 category 列表
  .post('/login', login) // 登录
  .post('/register', register) // 注册


module.exports = router
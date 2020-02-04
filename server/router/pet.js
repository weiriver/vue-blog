const Router = require('koa-router')
const router = new Router({prefix: '/pet'})
const {getList} = require('../controllers/pet')

router.get('/list', getList) // 获取列表


module.exports = router
const Koa = require('koa')
const config = require('./config')
const db = require('./models')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const error = require('koa-json-error')
const logger = require('koa-logger')
const loadRouter = require('./router')
const authHandler = require('./middlewares/authHandler')
const app = new Koa()
const context = require('./utils/context')

Object.keys(context).forEach(key => {
  app.context[key] = context[key]
})

app
  .use(cors())
  .use(koaBody({
    multipart: true,
    formidable: {
      // uploadDir: path.resolve(__dirname, './upload'),
      keepExtensions: true, // 保持文件的后缀
      maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
    }
  }))
  .use(
    error({
      postFormat: (e, {stack, ...rest}) => (process.env.NODE_ENV !== 'development' ? rest : {stack, ...rest})
    })
  )
  .use(authHandler)
  .use(logger())

loadRouter(app)

app.listen(config.PORT, () => {
  db.sequelize
  // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
  // sync(): 当开始一个新项目时，你还没有数据库结构，而使用Sequelize则不再需要数据库结构。只需指定模型结构，然后让库完成其余工作即可。当前支持创建和删除表：
  //   .sync({force: true, logging: false})
    .sync({force: false, logging: false})
    .then(async () => {
      const initData = require('./initData')
      initData()
      console.log(`服务启动成功,监听链接 http://localhost:${config.PORT}`)
    })
    .catch(err => {
      console.log(err)
    })

})


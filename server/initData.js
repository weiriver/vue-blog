const {ADMIN_GITHUB_LOGIN_NAME} = require('./config')
const UserController = require('./controllers/user')
const AricleController = require('./controllers/article')
const TreeController = require('./controllers/tree')

module.exports = () => {
  UserController.initGithubUser(ADMIN_GITHUB_LOGIN_NAME) // 创建 role === 1 的账号 from github...
  AricleController.initAboutPage()
  TreeController.initTree()
}

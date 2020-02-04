const fs = require('fs')

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(fileName => {
    if (fileName == 'index.js') return
    const route = require(`./${fileName}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}

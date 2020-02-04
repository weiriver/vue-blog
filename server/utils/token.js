const jwt = require('jsonwebtoken')
const {TOKEN} = require('../config')

// 创建token
exports.createToken = info => {
  const token = jwt.sign(info, TOKEN.secret, {expiresIn: TOKEN.expiresIn})
  // console.log(token)
  return token
}

// 校验token
exports.checkToken = (ctx, roleList = []) => {
  let isVerify = false

  function _verify(token) {
    return jwt.verify(token, TOKEN.secret, function (err, decoded) {
      if (err) {
        return false
      } else if (decoded) {
        return !!roleList.find(item => item.role === decoded.role)
      }
      return false
    })
  }

  for (const item of roleList) {
    // console.log(item.verifyTokenBy)
    if (item.verifyTokenBy == 'headers') {
      const authorizationHeader = ctx.headers['authorization']
      // console.log('authorizationHeader', authorizationHeader)
      if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1] // 取到 token
        // console.log('token', token)
        const result = _verify(token)
        if (result) {
          isVerify = true
          break
        }
      }
    } else {
      const {token} = ctx.query
      if (token) {
        const _token = token.split(' ')[1] // 取到 token 过滤 Bearer
        const result = _verify(_token)
        if (result) {
          isVerify = true
          break
        }
      }
    }
  }

  return isVerify


  //{"username":"river","role":1,"userId":34113678,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpdmVyIiwidXNlcklkIjozNDExMzY3OCwicm9sZSI6MSwiaWF0IjoxNTc3NjkxNzQyLCJleHAiOjE1ODAyODM3NDJ9.TLCJOH-UEwHZwx9sZXwnWiyffV_1mYWfZ0FQATRzD3A"}
}

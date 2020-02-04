const {checkToken} = require('../utils/token')

/**
 * role === 1 需要权限的路由
 * @required 'all': get post put delete 均需要权限。
 */
const verifyList1 = [
  {regexp: /\/article\/output/, required: 'get', verifyTokenBy: 'url'}, // 导出文章 verifyTokenBy 从哪里验证 token
  {regexp: /\/article/, required: 'post, put, delete'}, // 普通用户 禁止修改或者删除、添加文章
  {regexp: /\/discuss/, required: 'delete, post'}, // 普通用户 禁止删除评论
  {regexp: /\/user/, required: 'get, put, delete'} // 普通用户 禁止获取用户、修改用户、以及删除用户
]

// role === 2 需要权限的路由
const verifyList2 = [
  {regexp: /\/discuss/, required: 'post'} // 未登录用户 禁止评论
]

function checkAuth(method, url) {

  function _vertify(list, role) {
    let target = list.find(v => {
      return v.regexp.test(url) && (v.required === 'all' || v.required.toUpperCase().includes(method))
    })
    return target
  }

  let roleList = []
  const result1 = _vertify(verifyList1)
  const result2 = _vertify(verifyList2)

  result1 && roleList.push({role: 1, verifyTokenBy: result1.verifyTokenBy || 'headers'})
  result2 && roleList.push({role: 2, verifyTokenBy: result1.verifyTokenBy || 'headers'})

  return roleList
}


module.exports = async (ctx, next) => {
  // 先对请求的 method 和 url 进行验证，如果请求的 method 和 url 属于 verifyList1 和 verifyList2 中的一员，则需要进行下一步验证，否则不需要验证，如：/login, /register
  const roleList = checkAuth(ctx.method, ctx.url)
  if (roleList.length > 0) {
    let pass = checkToken(ctx, roleList)
    if (pass) {
      await next()
    } else {
      ctx.throw(401)
    }
  } else {
    await next()
  }
}

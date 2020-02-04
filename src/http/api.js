import axios from './index'

// export const uploadFile = formData => {
//   const res = axios.request({
//     method: 'post',
//     url: '/upload',
//     data: formData,
//     headers: {'Content-Type': 'multipart/form-data'}
//   })
//   return res
// }
// const postFile = (url, obj, files) => {
//   let data = new FormData()
//   // data.append('token', store.state.token)
//   for (var key in obj) {
//     if (typeof obj[key] === 'object') {
//       data.append(key, JSON.stringify(obj[key]))
//     } else {
//       data.append(key, obj[key])
//     }
//   }
//   files.forEach((val, i) => {
//     data.append('files', val.raw)
//   })
//   // 附件以base64形式上传（如：流程里面的高拍仪）
//   return axios({
//     method: 'post',
//     data: data,
//     withCredentials: false,
//     headers: {'Content-Type': 'multipart/form-data'}
//   })
// }

export const postJson = (url, data, responseType = 'json') => {
  return axios({
    method: 'post',
    url,
    data: data,
    headers: {'Content-Type': 'application/json'},
    responseType
  })
}

export const deleteJson = (url, data, responseType = 'json') => {
  return axios({
    method: 'delete',
    url,
    params: data,
    headers: {'Content-Type': 'application/json'},
    responseType
  })
}

export const getJson = (url, data, responseType = 'json') => {
  return axios({
    method: 'get',
    url,
    params: data,
    headers: {'Content-Type': 'application/json'},
    responseType
  })
}

export const api = {
  // 注册
  register: (data) => postJson('/register', data),
  // 登录
  login: (data) => postJson('/login', data),
  // 新增文章
  addArticle: (data) => postJson('/article', data),
  // 有道
  createBlogFromYoudao: () => postJson('/article/youdao'),
  // 获取文章列表
  getArticleList: (data) => getJson('/article/list', data),
  // 获取文章详情
  getArticleById: (data) => getJson(`/article/${data}`),
  // 删除文章
  deleteArticleById: (data) => deleteJson(`/article/${data}`),
  // 修改文章
  updateArticleById: (data) => postJson(`/article/${data.id}`, data.content),
  // 导出单个文章
  exportArticleById: (data) => getJson(`/article/output/${data.id}`, data.content, 'blob'),
  // 导出所有文章
  exportArticleAll: (data) => getJson(`/article/output/all`, data, 'blob'),
  // 获取用户列表
  getUserList: (data) => getJson('/user/list', data),
  // 更新用户
  updateUserById: (data) => postJson(`/user/${data.id}`, data.content),
  // 删除用户
  deleteUserById: (data) => deleteJson(`/user/${data}`),
  // 发送评论
  postDiscuss: (data) => postJson(`/discuss/`, data),
  // 删除回复
  deleteComment: (data) => postJson(`/discuss/comment/${data}`),
  deleteReply: (data) => postJson(`/discuss/reply/${data}`),
  // 获取分类列表
  getCategoryList: (data) => getJson('/category/list', data),
  // 获取标签列表
  getTagList: (data) => getJson('/tag/list', data),
  // 获取文章结构列表
  getTreeList: (data) => getJson('/tree/list', data),
  // 新增tree节点
  addTreeNode: (data) => postJson('/tree/addnode', data),
  // 更新tree节点
  updateTreeNode: (data) => postJson('/tree/updateNode', data),
  // 更新tree节点
  deleteTreeById: (data) => deleteJson(`/tree/${data}`)
}

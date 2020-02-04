import {api} from '../http/api'
import {showMsg} from '@/utils/util'

const actions = {
  clearCookie: () => {
    var myDate = new Date()
    myDate.setTime(-1000) // 设置时间
    var data = document.cookie
    var dataArray = data.split('; ')
    for (var i = 0; i < dataArray.length; i++) {
      var varName = dataArray[i].split('=')
      document.cookie = varName[0] + '=\'\'; expires=' + myDate.toGMTString()
    }
  },
  logoff: async ({commit}, {username}) => {
    actions.clearCookie()
    sessionStorage.clear()
    let arr = ['token', 'role', 'username', 'userId']
    arr.forEach(v => {
      commit('SET_DATA', {target: v, content: ''})
    })
  },
  async fetchArticleList({commit, state}, data) {
    if (!data.keyword) {
      if (state.keywordForSearchAritilce) {
        data.keyword = state.keywordForSearchAritilce
        showMsg(`全局关键字 "${state.keywordForSearchAritilce}" 搜索`)
      } else {
        delete data.keyword
      }
    }
    let res = await api.getArticleList(data)
    if (res) {
      commit('SET_DATA', {target: 'articleList', content: res})
    }
  },
  async fetchTagList({commit}, data) {
    let res = await api.getTagList(data)
    commit('SET_DATA', {target: 'tagList', content: res})
  },
  async fetchCategoryList({commit}, data) {
    let res = await api.getCategoryList(data)
    commit('SET_DATA', {target: 'categoryList', content: res})
  }
}
export default actions

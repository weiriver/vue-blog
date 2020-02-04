import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import markdown from '@/utils/markdown'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    role: sessionStorage.getItem('role') || 2,
    token: sessionStorage.getItem('token'),
    userId: sessionStorage.getItem('userId'),
    username: sessionStorage.getItem('username'),
    articleList: {count: 0, rows: []}, // 文章列表
    categoryList: {count: 0, rows: []}, // 分类列表
    // categoryList: [], // 分类列表
    tagList: {count: 0, rows: []}, // 标签列表
    // tagList: [], // 标签列表
    keywordForSearchAritilce: '',
    resetPage: false
  },
  mutations,
  actions,
  getters: {
    decodeMarkdown: state => {
      state.articleList.rows.forEach(async v => {
        v.content = (await markdown.marked(v.content)).content
      })
      return state.articleList.rows
    }
  },
  modules: {}
})

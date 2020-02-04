<template>
  <div class="article-body">
    <div class="article-left" :class="{about:isAboutPage || hideAnchor}">
      <div v-if="!isAboutPage">
        <div class="article-title tc mb20 mt20">{{detail.title}}</div>
        <div class="article-footer tc">
          <i class="el-icon-chat-round"></i>
          <span class="chat-num mr10"> {{count}}</span>
          <i class="el-icon-view"></i>
          <span class="view-num"> {{detail.viewCount}}</span>

          <el-divider direction="vertical"></el-divider>

          <i class="el-icon-price-tag"></i>
          <c-tag v-for="item in detail.tags"
                 :key="item.label"
                 :type="item.type"
                 class="ml10 pointer"
                 effect="plain"
                 @click="$router.push(`/tags/${item.name}`)"
          >
            {{ item.name }}
          </c-tag>

          <el-divider direction="vertical"></el-divider>
          <i class="el-icon-folder"></i>
          <!--:type="item.type"-->
          <c-tag v-for="item in detail.categories"
                 :key="item.label"
                 type="danger"
                 size="small"
                 class="ml10 pointer"
                 effect="dark"
                 @click="$router.push(`/categories/${item.name}`)"
          >
            {{ item.name }}
          </c-tag>
        </div>
        <el-divider/>
        <section class="article-detail v-note-wrapper markdown-body shadow v-note-show" id="content"
                 v-html="detail.content"></section>
      </div>

      <about v-if="isAboutPage" class="mb20"/>

      <div class="discuss-info mt25">
        <div class="discuss-num">
          <el-link type="primary">{{count}}</el-link>
          条评论
        </div>
        <div class="discuss-user">
          <c-login ref="login"/>
          <c-register ref="register"/>
          <el-dropdown>
          <span class="el-dropdown-link">
            {{ username ? username : '未登录用户' }} <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div v-if='!username' @click="handleLogin">登录</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div v-if='!username' @click="handleRegister">注册</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div v-if='username' @click="handleLogOff">注销</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-divider/>

      <div class="discuss-reply">
        <el-avatar class='discuss-avatar mr10' size="large"
                   src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <el-input class='discuss-txt' type="textarea" :autosize="{minRows:4,maxRows:10}" v-model="yourReply"></el-input>
      </div>
      <div class="add-reply mt20">
        <el-link :underline="false" type="primary"><i class="el-icon-info mr20"> 支持 Markdown 语法</i>
        </el-link>
        <el-button type="primary" size="small" @click="doReply(-1,-2,yourReply, 0)">添加评论</el-button>
      </div>

      <div class="comments-body" v-for="(item,i) in detail.comments" :key="item.id">
        <el-avatar class="comments-avatar ml10 mr10"> {{item.user ? item.user.username : '' }}</el-avatar>
        <div class="comments-right">
          <div class="username"> {{item.user ? item.user.username : '' }} <span> {{item.createdAt}} </span></div>
          <div class="comments-content" v-html="item.content"></div>
          <div class="do-reply">
            <span class="pointer reply mr20" @click="showReplyBox(i,-1)">回复</span>
            <span class="pointer delete" @click="deleteComment(i, item.id)" v-if="role==1">
            <i class="el-icon-delete"></i>
          </span>
            <div class="reply-box" v-if="item.showReplyBox">
              <el-input class='discuss-txt mt10 mb10' type="textarea" :autosize="{minRows:2,maxRows:10}"
                        v-model="item.replyContent"></el-input>
              <el-button type="success" icon="el-icon-check" size="small" class="reply-btn"
                         @click="doReply(i,-1,item.replyContent, item.id)">
                <!--(Ctrl or ⌘ + Enter) -->
                回复
              </el-button>
            </div>
          </div>
          <div class="owner-reply" v-for="(oItem,j) in item.replies" :key="oItem.id">
            <el-avatar class="comments-avatar ml10 mr10"> {{oItem.user? oItem.user.username : '' }}</el-avatar>
            <div class="comments-right">
              <div class="username"> {{oItem.user? oItem.user.username : '' }} <span>{{oItem.createdAt}}</span></div>
              <div class="comments-content" v-html="oItem.content"></div>
              <div class="do-reply mt10">
                <span class="pointer reply mr20" @click="showReplyBox(i,j)">回复</span>
                <span class="pointer delete" @click="deleteReply(i, j, oItem.id)" v-if="role==1">
                <i class="el-icon-delete"></i>
              </span>
                <div class="reply-box" v-if="oItem.showReplyBox">
                  <el-input class='discuss-txt mt10 mb10' type="textarea" :autosize="{minRows:2,maxRows:10}"
                            v-model="oItem.replyContent"></el-input>
                  <el-button type="success" icon="el-icon-check" size="small" class="reply-btn"
                             @click="doReply(i,j,oItem.replyContent,item.id)">
                    <!--(Ctrl or ⌘ + Enter) -->
                    回复
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="article-right" v-if="!hideAnchor" :style="{top:top+'px'}">
      <!--<div class="anchor" :class="{'fixed-top':fixedTop}">-->
      <div class="anchor">
        <span class="level1 title" style="">
          <i class="el-icon-s-operation"></i> 文章导航
        </span>
        <div v-for="(item,index) in anchorArr" :key="item.id" @click="scrollTo(item.id, index)"
             class="pointer level"
             :class="['level'+item.level, {active: anchorActiveIndex == index}]"
             :title="item.title">
          <div class="anchor-title">{{item.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import markdown from '@/utils/markdown'
import 'highlight.js/styles/github.css'
// import 'highlight.js/styles/a11y-dark.css'
// import 'highlight.js/styles/a11y-light.css'
import {mapState} from 'vuex'
import CLogin from '@/components/login/Index'
import CRegister from '@/components/register/Index'
import About from '@/views/web/about/Index'
// import remoteLoad from '@/util/remoteLoad'

export default {
  name: 'Article',
  data() {
    return {
      hideAnchor: false,
      isAboutPage: false,
      id: '',
      detail: {
        comments: []
      },
      count: 0,
      top: 80,
      yourReply: '',
      anchorArr: [],
      fixedTop: false,
      anchorActiveIndex: 0
    }
  },
  watch: {
    $route: 'routerChange'
  },
  computed: {
    ...mapState(['username', 'userId', 'role'])
  },
  methods: {
    scrollTo(id, index) {
      this.anchorActiveIndex = index
      let dom = document.getElementById('#' + id)
      let b = document.getElementsByClassName('page-component__scroll')[0]
      b.scrollTo({top: dom.offsetTop, behavior: 'smooth'})
    },
    async routerChange() {
      this.id = this.$route.params.id
      if (this.id && this.id != -1) {
        this.isAboutPage = false
        this.hideAnchor = true
        this.init()
      } else if (this.$route.name == 'about') { // 关于页面
        this.id = -1
        this.hideAnchor = true
        this.isAboutPage = true
      }
    },
    scrollHandler() {
      let dom = document.getElementsByClassName('page-component__scroll')[0]
      if (dom.scrollTop > 80) {
        // this.fixedTop = true
        this.top = 6
      } else {
        this.top = 80 - dom.scrollTop
        // this.fixedTop = false
      }
    },
    async init() {
      let _this = this
      window.addEventListener('scroll', _this.scrollHandler, true)
      // let dom = document.getElementsByClassName('page-component__scroll')[0]
      // dom.addEventListener('scroll', _this.scrollHandler())
      const loading = this.$loading({
        lock: true,
        text: 'Loading, (⊙o⊙)拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.6)'
      })
      let result = await this.api.getArticleById(this.id)
      loading.close()
      this.detail = {
        comments: []
      }
      const res = await markdown.marked(result.content)
      result.content = res.content
      this.count = result.comments.length
      result.comments.forEach(async v => {
        this.count += v.replies.length
        v.content = (await markdown.marked(v.content)).content
      })
      this.detail = result
      // let regexp = /(id=#)\S*>/g
      let regexp = /(id=#).*>/g
      let arr = this.detail.content.match(regexp)
      if (arr) {
        this.anchorArr = arr.map(v => {
          let idRegexp = /#[a-zA-Z0-9]*>/g
          let titleRegexp = />.*</g
          let idStr = v.match(idRegexp)[0]
          let titleStr = v.match(titleRegexp)[0]
          let level = v.substr(v.length - 2, 1)
          return {
            level,
            title: titleStr.substr(1, titleStr.length - 2),
            id: idStr.substr(1, idStr.length - 2)
          }
        })
        this.hideAnchor = false
      } else {
        this.hideAnchor = true
      }
    },
    async deleteComment(index, commentId) { // 删除一级评论
      this.$confirm('将永久删除该评论及所有回复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.detail.comments.splice(index, 1)
        await this.api.deleteComment(commentId)
      }).catch(() => {
      })
    },
    async deleteReply(first, second, replyId) { // 删除回复
      this.$confirm('将永久删除该回复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.detail.comments[first].replies.splice(second, 1)
        await this.api.deleteReply(replyId)
      }).catch(() => {
      })
    },
    handleLogin() {
      this.$refs.login.loginDialogFormVisible = true
    },
    handleRegister() {
      this.$refs.register.registerDialogFormVisible = true
    },
    handleLogOff() {
      this.$store.dispatch('logoff', {username: this.username})
    },
    showReplyBox(firstIndex, secondIndex) {
      this.detail.comments.forEach((v, i) => {
        this.$set(this.detail.comments[i], 'showReplyBox', false)
        if (v.replies && v.replies.length) {
          v.replies.forEach((v, j) => {
            this.$set(this.detail.comments[i].replies[j], 'showReplyBox', false)
          })
        }
      })
      if (secondIndex == -1) {
        this.$set(this.detail.comments[firstIndex], 'showReplyBox', true)
      } else {
        this.$set(this.detail.comments[firstIndex].replies[secondIndex], 'showReplyBox', true)
      }
    },
    async doReply(firstLevel, secondLevel, content, commentId) {
      if (!this.userId) return this.showMsg('请先登录', 'warning')
      if (!content) return this.showMsg('不要吝啬您的文墨', 'warning')
      let res = await this.api.postDiscuss({
        userId: this.userId, articleId: this.id, content, commentId
      })
      if (res.message) return this.showMsg(res.message, 'error')
      this.count = res.rows.length
      res.rows.forEach(async v => {
        this.count += v.replies.length
        v.content = (await markdown.marked(v.content)).content
      })
      this.$set(this.detail, 'comments', res.rows)

      if (firstLevel == -1) { // 评论
        this.yourReply = ''
      } else {
        if (secondLevel == -1) {
          this.$set(this.detail.comments[firstLevel], 'replyContent', '')
        } else {
          this.$set(this.detail.comments[firstLevel].replies[secondLevel], 'replyContent', '')
        }
      }
    },
    async remoteLoad() {
      let url = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css" rel="stylesheet'

      /**
       * 创建script
       * @param url
       * @returns {Promise}
       */
      function createScript(url, hasCallback) {
        let scriptElement = document.createElement('link')
        // document.head.appendChild(scriptElement)
        document.head.insertBefore(scriptElement, document.head.getElementsByTagName('title')[0])
        let promise = new Promise((resolve, reject) => {
          scriptElement.addEventListener('load', e => {
            removeScript(scriptElement)
            if (!hasCallback) {
              resolve(e)
            }
          }, false)

          scriptElement.addEventListener('error', e => {
            removeScript(scriptElement)
            reject(e)
          }, false)

          if (hasCallback) {
            window.____callback____ = function () {
              resolve()
              window.____callback____ = null
            }
          }
        })

        if (hasCallback) {
          // url += '&callback=____callback____'
        }

        scriptElement.href = url

        return promise
      }

      /**
       * 移除script标签
       * @param scriptElement script dom
       */
      function removeScript(scriptElement) {
        document.head.removeChild(scriptElement)
      }

      return createScript(url, null)
    }
  },
  async mounted() {
    // await remoteLoad(this.cdnConfig.amap)
    // this.remoteLoad()
    this.routerChange()
  },
  components: {CLogin, About, CRegister}
}
</script>
<style lang="scss">

  .article-body {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    .article-left {
      width: calc(100% - 250px);
      &.about {
        width: 100%;
      }
    }
    .article-right {
      position: fixed;
      top: 80px;
      right: 18px;
      bottom: 0px;
      width: 250px;
      font-size: 16px;
      line-height: 32px;
      transition: 0.3s linear;
      color: #555;
      margin-left: 10px;
      box-sizing: border-box;
      overflow-y: auto;
      .anchor {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 0;
        border-left: 3px solid #e8e8e8;
        height: auto;
        font-size: 14px;
        .level {
          position: relative;
          box-sizing: border-box;
          &.active {
            color: $main-color;
            &:before {
              content: '';
              display: inline-block;
              width: 3px;
              height: 22px;
              background: $main-color;
              position: absolute;
              left: -3px;
              top: 5px;
            }
          }
          .anchor-title {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        & > .level1 {
          padding-left: 10px;
          font-size: 16px;
          &.title {
            color: #3d3d3d;
          }
        }
        & > .level2 {
          padding-left: 20px;
        }
        & > .level3 {
          font-size: 14px;
          padding-left: 30px;
        }
        & > .level3 {
          padding-left: 40px;
        }
        & > .level4 {
          padding-left: 48px;
        }
        & > .level5 {
          padding-left: 58px;
        }
        & > .level6 {
          padding-left: 58px;
        }
        &.fixed-top {
          top: 6px;
        }
      }
    }
  }

  /*.article-detail {*/
  /*min-height: 100px;*/
  /*font-size: 14px;*/
  /*ul {*/
  /*li {*/
  /*list-style: circle inside;*/
  /*line-height: 26px;*/
  /*p {*/
  /*margin: 0;*/
  /*display: inline-block;*/
  /*vertical-align: top;*/
  /*}*/
  /*& > ul {*/
  /*margin-left: 20px;*/
  /*}*/
  /*}*/
  /*}*/
  /*blockquote {*/
  /*position: relative;*/
  /*display: block;*/
  /*margin: 1em 0;*/
  /*border-left: 4px solid #ddd;*/
  /*padding: 0 1em;*/
  /*height: auto;*/
  /*min-height: 28px;*/
  /*line-height: 28px;*/
  /*color: #666;*/
  /*& > p {*/
  /*color: #333333;*/
  /*}*/
  /*}*/
  /*pre {*/
  /*padding: 10px;*/
  /*overflow: auto;*/
  /*margin: 20px 0;*/
  /*font-size: 16px;*/
  /*color: #4d4d4c;*/
  /*background: #f7f7f7;*/
  /*line-height: 1.6;*/
  /*}*/
  /*}*/

  .discuss-info {
    display: flex;
    justify-content: space-between;

    .discuss-num {
      flex: 1;
    }

    .discuss-user {
      width: 200px;
      text-align: right;
    }
  }

  .discuss-reply {
    display: flex;

    .discuss-avatar {
    }

    .discuss-txt {
      flex: 1;
    }
  }

  .add-reply {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .comments-body, .owner-reply {
    display: flex;

    .comments-right {
      flex: 1;

      .username {
        font-size: 16px;
        line-height: 40px;
        color: $main-color;

        span {
          color: #bbb;
          font-size: 12px;
          margin-left: 10px;
        }
      }

      .do-reply {
        color: #bbb;
        font-size: 13px;
        margin-bottom: 20px;

        .delete {
          color: red;
        }

        .reply-box {
          position: relative;
          padding-bottom: 40px;

          .reply-btn {
            position: absolute;
            bottom: 4px;
            right: 0px;
          }
        }

      }
    }
  }
</style>

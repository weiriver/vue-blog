<template>
  <div class="header">
    <div class="logo">
      <el-avatar :src="logo" style="vertical-align: middle"></el-avatar>
      张伟江的博客
    </div>
    <el-row class="h-right" type="flex" justify="end">
      <el-col :span="8">
        <el-input placeholder="全局搜索" v-model="keyword" @keyup.13.native="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="16">
        <div class="tags">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <router-link :to="item.to" v-for="(item,index) in menuList"
                         :key="item.id">
              <el-menu-item :index="index+1+''">
                <i :class="item.icon"></i>{{item.title}}
              </el-menu-item>
            </router-link>

            <el-menu-item v-if="!username">
              <el-button size="small" type="primary" @click="doLogin">登录</el-button>
              <el-button size="small" type="danger" @click="doRegister" plain>注册</el-button>
            </el-menu-item>

            <el-menu-item v-if="username">
              <useractions/>
            </el-menu-item>

          </el-menu>
        </div>
      </el-col>
    </el-row>

    <c-login ref="login"/>
    <c-register ref="register"/>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import CLogin from '@/components/login/Index'
import CRegister from '@/components/register/Index.vue'

export default {
  name: 'Header',
  data() {
    return {
      logo: require('@/assets/images/logo.jpg'),
      keyword: '',
      activeIndex: '1',
      loginDialogFormVisible: false,
      menuList: [
        {to: '/home', icon: 'el-icon-house', title: '首页'},
        {to: '/archives', icon: 'el-icon-star-off', title: '归档'},
        {to: '/categories', icon: 'el-icon-folder', title: '分类'},
        {to: '/about', icon: 'el-icon-user', title: '关于'}
      ]
    }
  },
  watch: {
    $route: 'routerChange'
  },
  computed: {
    ...mapState(['username', 'role'])
  },
  methods: {
    ...mapMutations(['SET_DATA']),
    routerChange() {
      let hash = this.$route.path.split('/')[1]
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].to.includes(hash)) {
          this.activeIndex = i + 1 + ''
          break
        }
      }
      if (this.$route.query.redirect && this.$route.name == 'home') {
        this.$refs.login.loginDialogFormVisible = true
      } else {
        this.$refs.login.loginDialogFormVisible = false
      }
    },
    search() {
      this.$router.push('/home')
      this.$store.commit('SET_DATA', {target: 'keywordForSearchAritilce', content: this.keyword})
      this.$store.commit('SET_DATA', {target: 'resetPage', content: true}) // 重置页面未1
      // if (this.keyword) this.showMsg(`全局关键字 "${this.keyword}" 搜索`)
      this.$store.dispatch('fetchArticleList', this.keyword ? {keyword: this.keyword, page: 1} : {page: 1})
    },
    doLogin() {
      this.$refs.login.loginDialogFormVisible = true
    },
    doRegister() {
      this.$refs.register.registerDialogFormVisible = true
    }
  },
  mounted() {
    this.routerChange()
  },
  components: {CLogin, CRegister}
}
</script>

<style lang="scss">
  .el-popover {
    min-width: 80px !important;
  }

  .popover-line {
    line-height: 32px;
    height: 32px;
  }
</style>
<style lang="scss" scoped>
  .header {
    display: flex;
    .logo {
      width: 260px;
      & > i {
        color: #3a93f1;
        font-size: 30px;
        vertical-align: middle;
      }
      img {
        border-style: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .h-right {
      flex: 1;
      .tags {
        float: right;
        flex: 1;
        justify-content: flex-end;
      }
    }
  }
</style>

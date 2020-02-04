<template>

  <div class="nav-body">
    <el-menu class="el-menu-vertical-demo"
             :unique-opened="true"
             :collapse="isCollapse"
             :default-active="activeIndex">
      <!--:default-active="activeName"-->
      <!--background-color="#545c64"-->
      <!--text-color="#fff"-->
      <!--active-text-color="#ffd04b"-->
      <el-button style="margin: 10px 0 0 18px;" type="text" @click="isCollapse=!isCollapse">
        {{isCollapse?'展开':'收缩'}}
      </el-button>

      <el-submenu class="nav-submenu" v-for="item in navList" :key="item.id" :index="item.id">
        <template slot="title">
          <i :class="item.icon ? item.icon : 'el-icon-news' "></i>
          <span slot="title">{{item.label}}</span>
        </template>
        <router-link :to="cItem.link" v-for="cItem in item.children" :key="cItem.id">
          <el-menu-item class="nav-item" :index="cItem.id">
            {{cItem.label}}
          </el-menu-item>
        </router-link>
      </el-submenu>

    </el-menu>
    <div class="avatar">
      <useractions/>
    </div>

  </div>
</template>
<script>

import {mapState} from 'vuex'

export default {
  data() {
    return {
      navList: [
        {
          id: '1',
          label: '文章',
          children: [
            {label: '文章管理', id: '1-1', link: '/admin/article/manager'},
            {label: '文章新增', id: '1-2', link: '/admin/article/edit'}
          ],
          icon: 'el-icon-menu'
        },
        {
          id: '2',
          label: '设置',
          children: [
            {label: '用户管理', id: '2-1', link: '/admin/user/'},
            {label: '文章结构', id: '2-2', link: '/admin/tree/'}
          ],
          icon: 'el-icon-setting'
        }
      ],
      remindCount: 0,
      form: {
        mobile: ''
      },
      tableData: [],
      drawer: false,
      direction: 'ttb',
      isCollapse: true,
      activeName: '1-1' // 左侧导航栏的子菜单项目高亮
    }
  },
  props: {
    // 列表数组暂不从父组件传进来，如以后有需要再开放该功能
    leftNavList: {
      type: Array,
      default: function () {
        return []
      }
    },
    activeIndex: {
      type: String,
      default: '1-1'
    }
  },
  computed: {
    ...mapState({
      userName: state => state['userName']
    })
  },
  methods: {
    async search() {
      // await this.friendRemind(this.form)
    },
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    clickAvatar() {
      console.log(123)
      this.drawer = true
    },
    resetForm(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].resetFields()
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    }
  },
  watch: {},
  async mounted() {
    this.search()
  },
  components: {}
}
</script>
<style lang="scss">

  .el-menu {
    border: none;
  }

  .el-submenu__title, .el-submenu .nav-item {
    height: 40px;
    line-height: 40px;
  }

  .nav-body {
    border-right: none;
    .el-menu--collapse {
      height: 100%;
    }
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }

  .avatar {
    position: absolute;
    left: 0;
    width: 64px;
    bottom: 20px;
    text-align: center;
    color: #66b1ff;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

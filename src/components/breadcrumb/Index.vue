<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }" v-for="item in breadList" :key="item.id">{{item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>

export default {
  name: 'breadcrumb',
  props: {},
  data() {
    return {
      breadList: [] // 路由集合
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    async init() {
      this.getBreadcrumb()
    },
    isHome(route) {
      return route.name === 'home'
    },
    getBreadcrumb() {
      let matched = this.$route.matched
      // 如果不是首页
      if (!this.isHome(matched[0])) {
        matched = [{path: '/home', meta: {title: '首页'}}].concat(matched)
      }
      this.breadList = matched
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
  .breadcrumb {
  }
</style>

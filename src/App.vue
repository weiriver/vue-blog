<template>
  <div class="page-component__scroll infinite-list" v-infinite-scroll="load" style=" overflow:auto">
    <!--<keep-alive>-->
    <router-view/>
    <!--</keep-alive>-->
    <el-backtop ref="backtop" target=".page-component__scroll" :bottom="80">
      <div style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        UP
      </div>
    </el-backtop>
  </div>

</template>

<script>

export default {
  name: 'app',
  components: {},
  watch: {
    $route: 'routerChange'
  },
  methods: {
    load() {
      let needLoadMoreViewsName = ['tags', 'archives', 'categories'] // 需要infinite-scroll的页面
      let viewName = this.$route.path.split('/')[1]
      for (let i = 0; i < needLoadMoreViewsName.length; i++) {
        if (viewName.includes(needLoadMoreViewsName[i])) {
          this.Event.$emit(`${viewName}LoadMore`)
          // break
        }
      }
    },
    routerChange() {
      this.$refs.backtop.scrollToTop()
    }
  }
}
</script>

<style>
  body {
    margin: 0
  }

  .page-component__scroll {
    height: 100%;
  }

  .page-component__scroll .el-scrollbar__wrap {
    overflow-x: auto;
  }
</style>

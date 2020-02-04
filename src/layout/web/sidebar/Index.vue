<template>
  <div class="side-bar">
    <!--<div class="user-info">-->
    <!--<img :src="logo" alt="">-->
    <!--<div class="username">江品一派</div>-->
    <!--<div class="jianjie">前端打杂人员，大前端追随者</div>-->
    <!--<div class="code-link">-->
    <!--<span>github</span>-->
    <!--<span>juejin</span>-->
    <!--</div>-->
    <!--</div>-->

    <el-divider content-position="center">
      <div class="divider-txt">文章目录</div>
    </el-divider>
    <div>
      <tree-structure/>
      <!--<el-drawer title="文章结构"-->
      <!--:modal="false"-->
      <!--:withHeader="false"-->
      <!--:visible.sync="drawer"-->
      <!--:direction="direction"-->
      <!--:show-close="false">-->
      <!--<div style="height: 100%; ">-->
      <!--<tree-structure/>-->
      <!--</div>-->
      <!--</el-drawer>-->
      <!--<el-link type="primary" :underline="false" @click="drawer = true">目录概况</el-link>-->

    </div>
    <div class="hot-article">
      <el-divider content-position="center">
        <div class="divider-txt">热门文章</div>
      </el-divider>
      <div class="hot pointer"
           v-for="(item) in hotArticleList"
           :key="item.id"
           @click="$router.push(`/article/${item.id}`)">
        {{item.title}}
      </div>
    </div>

    <div class="tags">
      <el-divider content-position="center">
        <div class="divider-txt">标签</div>
      </el-divider>
      <c-tag v-for="item in tagList"
             class="pointer mt10 mr10 "
             :key="item.id"
             :type="item.type"
             size="small"
             @click="$router.push(`/tags/${item.name}`)"
             effect="plain">
        {{ item.name }}
      </c-tag>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex'
import TreeStructure from '@/components/treeStructure/Index'

export default {
  name: 'side-bar',
  components: {TreeStructure},
  computed: {
    ...mapState(['tagList'])
  },
  data() {
    return {
      drawer: false,
      direction: 'ltr',
      logo: require('@/assets/images/logo.jpg'),
      hotArticleList: [],
      items: []
    }
  },
  methods: {
    async getHotArticleList() {
      let res = await this.api.getArticleList({order: 'viewCount DESC', page: 1, pageSize: 6})
      this.hotArticleList = res.rows
    }
  },
  async mounted() {
    this.$store.dispatch('fetchTagList')
    this.getHotArticleList()
  }
}
</script>

<style lang="scss">
  .el-aside {
    height: 100%;
  }
  .side-bar {
    padding-top: 2px;
    border-right: 1px solid #ebedf0;
    /*min-height: calc(100vh - 64px - 40px);*/
    height: 100%;
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      div {
        line-height: 42px;
        font-size: 13px;
      }
      .username {
        font-size: 22px;
        font-weight: bolder;
      }
      .code-link {
        line-height: 30px;
        span {
          display: inline-block;
          width: 80px;
          color: #2d8cf0;
        }
      }
    }
    .divider-txt {
      font-size: 16px;
      font-weight: bold;
    }
    .hot-article {
      .hot {
        width: calc(100% - 20px);
        box-sizing: border-box;
        padding-left: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 32px;
        text-align: left;
        cursor: pointer;
        &:hover {
          color: $main-color;
        }
      }
    }
    .tags {
      padding-bottom: 20px;
      .c-tag {
        margin: 4px;
      }
    }
  }
</style>

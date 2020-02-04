<template>
  <div class="home">
    <el-card shadow="hover" class="mt20 ml20 mr20" v-for="(item,index) in articles" :key="item.id">
      <el-divider content-position="left">
        <span class="article-title pointer" @click="$router.push(`/article/${item.id}`)">
          {{index+1}}. {{item.title}}
        </span>
        <span class="article-date">{{item.createdAt.substr(0,10)}}</span>
      </el-divider>
      <p class="article-content" v-html="item.content"></p>
      <div class="article-footer">

        <i class="el-icon-chat-round"></i>
        <span class="chat-num mr10 ml10">{{item.comments.length}}</span>
        <i class="el-icon-view"></i>
        <span class="view-num ml10">{{item.viewCount}}</span>

        <el-divider direction="vertical"></el-divider>

        <i class="el-icon-price-tag"></i>
        <c-tag v-for="item in item.tags"
               :key="item.label"
               :type="item.type"
               size="small"
               class="ml10 pointer"
               effect="plain"
               @click="$router.push(`/tags/${item.name}`)"
        >
          {{ item.name }}
        </c-tag>

        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-folder"></i>
        <c-tag v-for="item in item.categories"
               :key="item.label"
               type="danger"
               size="small"
               class="ml10 pointer"
               effect="dark"
               color="#409EFF"
               @click="$router.push(`/categories/${item.name}`)"
        >
          {{ item.name }}
        </c-tag>
      </div>
    </el-card>

    <MyPagination :totalCount="articleList.count" actionTarget="fetchArticleList" :serachForm="form"></MyPagination>
  </div>
</template>

<script>
// @ is an alias to /src
import MyPagination from '@/components/pagination/Index.vue'
import {mapState} from 'vuex'
// import markdown from '@/utils/markdown'

export default {
  name: 'home',
  components: {MyPagination},
  data() {
    return {
      totalCount: 0,
      tableData: [],
      form: {
        page: 1,
        pageSize: 10,
        status: true
      }
    }
  },
  computed: {
    ...mapState(['articleList', 'keywordForSearchAritilce']),
    articles() {
      return this.$store.getters.decodeMarkdown
    }
  },
  watch: {},
  methods: {
    async init() {
    },
    search() {
    },
    async query() {
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss">
  .article-title {
    color: #394d69;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.2;
    cursor: pointer;
  }

  .article-date {
    font-size: 0.5em;
    padding-left: 20px;
  }

  .article-footer {
    padding-left: 20px;
    font-size: 14px;
    color: gray;
  }

  .article-content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    max-height: 200px;
    font-size: 14px;
    margin: 0 auto;
    font-family: 'Lato', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: #555;
    line-height: 2;
    text-indent: 20px;
    margin-bottom: 20px;
  }
</style>

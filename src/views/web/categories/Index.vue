<template>
  <div class="categories mt20 ml10 mr20">
    <c-timeline v-if="title" :title="title" type="Category" :array="data" @click="handleClick"/>
    <div v-if="!title" class="category-list">
      <h2 class="mt20 mb25">Categories 分类</h2>
      <h3>{{tags.length}} categories in total</h3>
      <div class="mt25">
        <el-badge v-for="item in tags" :value="item.count" :key="item.name" class="mr20 mt20 pointer">
          <c-tag :type="item.type"
                 size="small"
                 effect="plain"
                 @click="$router.push(`/categories/${item.name}`)"
          >
            {{ item.name }}
          </c-tag>
        </el-badge>
      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CTimeline from '@/components/timeline/main'

export default {
  name: 'categories',
  data() {
    return {
      title: '',
      tags: [],
      data: [],
      page: 0,
      isEnd: false
    }
  },
  components: {CTimeline},
  watch: {
    $route: 'routerChange'
  },
  methods: {
    handleClick(item) {
      this.$router.push(`/article/${item.id}`)
    },
    routerChange() {
      this.isEnd = false
      this.page = 0
      this.data = []
      this.title = this.$route.params.name
      this.init()
    },
    init() {
      if (this.title) {
        this.getArticleList()
      } else {
        this.getCategoryList()
      }
    },
    async getCategoryList() {
      this.tags = await this.api.getCategoryList({isdraft: false, status: true})
    },
    async getArticleList() {
      if (!this.isEnd) {
        ++this.page
        let res = await this.api.getArticleList({category: this.title, page: this.page, isdraft: false, status: true})
        if (res.rows.length < 10) this.isEnd = true
        this.data = [...(this.data), ...res.rows]
      }
    }
  },
  mounted() {
    this.routerChange()
    this.Event.$on('categoriesLoadMore', () => {
      console.log('我要加载更多')
      this.getArticleList()
    })
  }
}
</script>

<style lang="scss">
  .category-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

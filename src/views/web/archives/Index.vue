<template>
  <div class="archives mt20 ml10 mr20">
    <c-timeline :title="title" type="" :array="data" @click="handleClick"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CTimeline from '@/components/timeline/main'

export default {
  name: 'archives',
  components: {CTimeline},
  data() {
    return {
      page: 0,
      count: 0,
      title: '',
      tags: [],
      data: [],
      isEnd: false
    }
  },
  methods: {
    init() {
      this.getArticleList()
    },
    handleClick(item) {
      this.$router.push(`/article/${item.id}`)
    },
    async getArticleList() {
      if (!this.isEnd) {
        ++this.page
        let res = await this.api.getArticleList({page: this.page, status: true})
        if (res.rows.length < 10) this.isEnd = true
        this.data = [...(this.data), ...res.rows]
        // this.data = this.data.concat(res.rows)
        // this.title = `Nice! ${res.count} posts in total. Keep on posting.`
        this.title = res.count ? `Nice! 共发布 ${res.count} 篇文章, 保持努力！` : '往日不可柬, 来日犹可追'
      }
    }
  },
  mounted() {
    this.init()
    this.Event.$on('archivesLoadMore', () => {
      this.getArticleList()
    })
  }
}
</script>

<style>
  .archives {
    min-height: 100%;
    min-height: calc(100vh - 40px);
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: flex-start;*/
    /*align-items: left;*/
  }
</style>


<template>
  <div class="tags mt20 ml10 mr20">
    <c-timeline :title="title" type="Tag" :array="data" @click="handleClick"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CTimeline from '@/components/timeline/main'

export default {
  name: 'tags',
  data() {
    return {
      page: 0,
      title: '',
      data: [],
      isEnd: false
    }
  },
  watch: {
    $route: 'routerChange'
  },
  components: {CTimeline},
  methods: {
    routerChange() {
      this.isEnd = false
      this.page = 0
      this.data = []
      this.title = this.$route.params.name
      this.getTagList()
    },
    async getTagList() {
      console.log(this.isEnd)
      if (!this.isEnd) {
        ++this.page
        console.log(this.page)
        let res = await this.api.getArticleList({tag: this.title, page: this.page})
        if (res.rows.length == 0) this.isEnd = true
        this.data = [...this.data, ...res.rows]
      }
    },
    handleClick(t) {
      this.$router.push(`/article/${t.id}`)
    }
  },
  mounted() {
    this.routerChange()
    this.Event.$on('tagsLoadMore', () => {
      this.getTagList()
    })
  },
  activated() {
  }
}
</script>

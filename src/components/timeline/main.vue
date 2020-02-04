<template>
  <div class="timeline">
    <el-timeline>
      <el-timeline-item color="skyblue" timestamp="" placement="top" :hide-timestamp="true">
        <div>
          <span class="title">{{title}}</span>
          <span class="type">{{type}}</span>
        </div>
      </el-timeline-item>

      <el-timeline-item :timestamp="item.createdAt.substr(0,10)"
                        placement="top"
                        v-for="(item,index) in array"
                        :hide-timestamp="true"
                        color="#1890ff"
                        :key="index">
        <div class="time-item">
          <span class="mr20">{{index + 1}}</span>
          <span>{{item.createdAt.substr(0,10)}}  </span>
          <el-link class="article-title" :underline="true" :href="item.link" @click="itemClicked(item)">
             {{item.title}}
          </el-link>
          <span> ( {{item.viewCount}} 次阅读 ) </span>
        </div>
      </el-timeline-item>

    </el-timeline>
  </div>
</template>
<script>
export default {
  name: 'CTimeline',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'Category'
    },
    array: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    itemClicked(item) {
      this.$emit('click', item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .timeline {
    .title {
      font-size: 20px;
    }
    .type {
      margin-left: 20px;
      font-size: 26px;
      color: #bbb;
    }
    .time-item {
      font-size: 18px;
      height: 32px;
      span {
        vertical-align: middle;
      }
      span:nth-of-type(1), span:nth-of-type(2) {
        font-size: 14px;
        color: #7b7b7b;
      }
      span:nth-of-type(3) {
        margin-left: 20px;
        font-size: 14px;
        color: #bbb;
      }
      .article-title {
        color: #233342;
        font-size: 15px;
        font-weight: normal;
        margin-left: 20px;
        &:hover {
          color: $main-color;
        }
      }
    }
  }
</style>

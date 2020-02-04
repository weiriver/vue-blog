<template>
  <el-container>
    <Nav></Nav>
    <el-main class="admin-right">
      <keep-alive :includes="includes">
        <router-view/>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
import Nav from '@/components/nav/Index.vue'
import {keepAlive} from '@/utils/cache'
export default {
  name: 'admin',
  data: function () {
    return {
      includes: keepAlive.includes
    }
  },
  watch: {},
  methods: {},
  async mounted() {
  },
  beforeDestroy() {
  },
  components: {Nav}
}
</script>

<style lang="scss">
  .admin-right {
    box-sizing: border-box;
    padding: 10px;
  }

</style>

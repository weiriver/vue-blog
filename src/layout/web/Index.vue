<template>
  <el-container>
    <el-header>
      <m-header/>
    </el-header>
    <el-container>
      <el-aside width="260px">
        <c-sidebar/>
      </el-aside>
      <el-main>
        <m-breadcrumb/>
        <keep-alive :include="includes">
          <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import CSidebar from './sidebar/Index'
import MHeader from './header/Header'
import MBreadcrumb from '@/components/breadcrumb/Index'
import {keepAlive} from '@/utils/cache'

export default {
  name: 'Main',
  components: {MHeader, CSidebar, MBreadcrumb},
  data() {
    return {
      includes: keepAlive.includes
    }
  },
  methods: {}
}
</script>

<style>

</style>

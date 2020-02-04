<template>
  <div class="useractions">
    <el-popover placement="bottom"
                title=""
                width="60"
                trigger="hover"
                content="">
      <div slot="reference" class="user">
        <el-avatar :src="logo"></el-avatar>
        {{username}}
      </div>
      <div style="text-align: center;">
        <div class="popover-line pointer" @click="$router.push('/home')">返回首页</div>
        <div class="popover-line pointer" @click="$router.push('/admin/article/manager')" v-if="role == 1">后台管理</div>
        <div class="popover-line pointer" @click="logout">退出</div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  name: 'useractions',
  data() {
    return {
      logo: require('@/assets/images/user-avatar.jpg')
    }
  },
  computed: {
    ...mapState(['role', 'username'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logoff', {username: this.username})
    }
  }
}
</script>
<style lang="scss" scoped>
  .useractions {
  }
</style>

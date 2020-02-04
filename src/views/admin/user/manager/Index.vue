<template>
  <div class="manager">
    <!-- 搜索框 -->
    <el-form :inline="true" :model="form">
      <el-form-item label="姓名">
        <el-input v-model="form.username" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">检索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="notice" label="邮件通知">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.notice" @change="change(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="disabledDiscuss" label="禁言">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.disabledDiscuss" @change="change(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="用户类型">
        <template slot-scope="scope">
          <span>{{scope.row.role == 2 ? '普通用户':'github用户'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="90"></el-table-column>
      <el-table-column prop="" label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import {mapState} from 'vuex'

var FileSaver = require('file-saver')

export default {
  name: 'manager',
  data() {
    return {
      form: {
        page: 1,
        pageSize: 1000
      },
      userList: []
    }
  },
  computed: {
    ...mapState(['tagList', 'categoryList', 'articleList'])
  },
  methods: {
    async change(item) {
      let {id, disabledDiscuss, notice} = item
      let res = this.api.updateUserById({id, content: {disabledDiscuss, notice}})
      if (res.code == 0) {
        this.showMsg('修改信息成功')
      }
    },
    async handleSearch() {
      let res = await this.api.getUserList(this.form)
      console.log(res)
      this.userList = res.rows
    },
    getTagList() {
      this.$store.dispatch('fetchTagList', {})
    },
    getCategoryList() {
      this.$store.dispatch('fetchCategoryList', {})
    },
    async deleteUser(id) {
      this.$confirm('将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.api.deleteUserById(id)
        if (res.code == 0) {
          this.showMsg('删除成功')
          this.handleSearch()
        }
      }).catch(() => {
      })
    },
    async exportArticle(title, id) {
      let res = await this.api.exportArticleById({
        id,
        content: {token: `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`}
      })
      // var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
      console.log(res)
      // var blob = new Blob([res], {type: 'text/plain;charset=utf-8'})
      var blob = new Blob([res], {type: 'text/markdown;charset=utf-8'})
      FileSaver.saveAs(blob, `${title}.md`)
    },
    async exportAll() {
      let res = await this.api.exportArticleAll({token: `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`})
      var blob = new Blob([res], {type: 'application/zip;charset=utf-8'})
      FileSaver.saveAs(blob, `所有文章.zip`)
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>
<style lang="scss">
  .manager {
    .el-select__tags {
      .el-tag.el-tag--info {
        background-color: white;
        border-color: #1495ff;
        color: #1495ff;
      }
    }
  }
</style>

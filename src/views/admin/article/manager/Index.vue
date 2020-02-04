<template>
  <div class="manager">
    <!-- 搜索框 -->
    <el-form ref="form" :inline="true" :model="form" label-width="68px">
      <el-form-item label="标签" prop="tag">
        <el-select v-model="form.tag" placeholder="标签" clearable>
          <el-option :label="item.name" :value="item.name" v-for="item in tagList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="分类" clearable>
          <el-option :label="item.name" :value="item.name" v-for="item in categoryList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否草稿" prop="isdraft">
        <!--<el-switch v-model="form.isdraft"></el-switch>-->
        <el-select v-model="form.isdraft" placeholder="文章分类">
          <el-option :label="item.name" :value="item.value" v-for="item in list" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否展示" prop="status">
        <el-select v-model="form.status" placeholder="是否展示文章">
          <el-option :label="item.name" :value="item.value" v-for="item in list" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="form.keyword" placeholder="标题 / 内容模糊搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">检索</el-button>
        <el-button type="primary" @click="reset('form')">重置</el-button>
        <!--<el-button type="primary" @click="youdao">同步有道云</el-button>-->
        <el-button type="primary" class="ml20" @click="exportAll">一键导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="articleList.rows" border style="width: 100%">
      <el-table-column prop="title" label="标题" minWidth="150"></el-table-column>
      <el-table-column prop="tags" label="标签" minWidth="150">
        <template slot-scope="scope">
          <c-tag v-for="item in scope.row.tags" :key="item.id" class="mr10">{{item.name}}</c-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categories" label="分类" minWidth="150">
        <template slot-scope="scope">
          <c-tag v-for="item in scope.row.categories" :key="item.id" class="mr10 mb10">{{item.name}}</c-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categories" label="设为草稿" minWidth="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isdraft"
                     @change="change(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="categories" label="展示文章" minWidth="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="change(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="浏览数" width="60"></el-table-column>
      <el-table-column prop="createdAt" label="发布时间" width="90"></el-table-column>
      <el-table-column prop="updatedAt" label="修改时间" width="90"></el-table-column>
      <el-table-column prop="viewCount" label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="$router.push(`/article/${scope.row.id}`)">查看</el-button>
          <el-button size="small" type="text" @click="$router.push(`/admin/article/edit/${scope.row.id}`)">编辑
          </el-button>
          <br>
          <el-button size="small" type="text" @click="exportArticle(scope.row.title,scope.row.id)">导出</el-button>
          <el-button size="small" type="text" @click="deleteArticle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <MyPagination ref="pagination" :totalCount="articleList.count" actionTarget="fetchArticleList"
                  :serachForm="form"></MyPagination>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import MyPagination from '@/components/pagination/Index.vue'

var FileSaver = require('file-saver')

export default {
  name: 'manager',
  data() {
    return {
      form: {
        page: 1,
        pageSize: 10,
        tag: null,
        category: null,
        keyword: '',
        status: 'all',
        isdraft: 'all'
      },
      list: [
        {name: '全部', value: 'all'},
        {name: '是', value: true},
        {name: '否', value: false}
      ]
    }
  },
  components: {MyPagination},
  computed: {
    ...mapState(['tagList', 'categoryList', 'articleList'])
  },
  methods: {
    async change(item) {
      let form = JSON.parse(JSON.stringify(item))
      delete form.createdAt
      delete form.updatedAt
      delete form.id
      delete form.viewCount
      delete form.comments
      form.tags = form.tags.map(v => {
        v = v.name
        return v
      })
      form.categories = form.categories.map(v => {
        v = v.name
        return v
      })
      let res = await this.api.updateArticleById({
        id: item.id,
        content: form
      })
      if (res.code == 0) {
        this.showMsg('更新完成')
      }
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    handleSearch() {
      if (!this.form.category) delete this.form.category
      if (!this.form.tag) delete this.form.tag
      // if (!this.form.keyword) delete this.form.keyword
      this.$refs.pagination.handleSearch()
      // this.$store.dispatch('fetchArticleList', this.form)
    },
    getTagList() {
      this.$store.dispatch('fetchTagList', {})
    },
    getCategoryList() {
      this.$store.dispatch('fetchCategoryList', {})
    },
    async youdao() {
      let res = await this.api.createBlogFromYoudao()
      console.log(res)
    },
    async deleteArticle(id) {
      this.$confirm('将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.api.deleteArticleById(id)
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
    this.getTagList()
    this.getCategoryList()
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

<template>
  <div class="edit">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="所属目录" prop="treeId">
        <el-input v-model="form.treeId" style="width:0%; visibility: hidden;"></el-input>
        <el-cascader v-model="treeIds"
                     style="width: 50%"
                     :options="options"
                     :props="{ expandTrigger: 'hover', checkStrictly: true  }"
                     @change="handleChange"></el-cascader>
      </el-form-item>

      <!-- 新增专用 -->
      <el-form-item label="标签" prop="tags">
        <el-select v-model="form.tags"
                   style="width: 50%;"
                   multiple
                   filterable
                   allow-create
                   default-first-option
                   placeholder="请选择文章标签">
          <el-option v-for="item in tagList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类" prop="categories">
        <el-select v-model="form.categories"
                   style="width: 50%;"
                   multiple
                   filterable
                   allow-create
                   default-first-option
                   placeholder="请选择文章标签">
          <el-option v-for="item in categoryList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 修改页面专用 -->
      <el-form-item v-if="id && false" label="标签" prop="tags">
        <el-tag class="input-new-tag mr10"
                :key="tag.id"
                v-for="tag in form.tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,'tag')">
          {{tag.name}}
        </el-tag>
        <el-input class="mr10"
                  style="width: 120px;"
                  v-if="tagInputVisible"
                  v-model="tagInputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="ml10" size="mini" @click="showTagInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item v-if="id && false" label="分类" prop="categories">
        <el-tag class="input-new-tag mr10"
                :key="category.id"
                v-for="category in form.categories"
                closable
                :disable-transitions="false"
                @close="handleClose(category,'category')">
          {{category.name}}
        </el-tag>
        <el-input class="mr10"
                  style="width: 120px;"
                  v-if="categoryInputVisible"
                  v-model="categoryInputValue"
                  ref="saveCategoryInput"
                  size="small"
                  @keyup.enter.native="handleCategoryInputConfirm"
                  @blur="handleCategoryInputConfirm"
        ></el-input>
        <el-button v-else class="ml10" size="mini" @click="showCategoryInput">+ New Category</el-button>
      </el-form-item>

      <mavon-editor v-model="form.content"/>
      <el-form-item class="mt20">
        <el-button type="primary" @click="onSubmit">{{id ? '修改文章' : '新增文章'}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import treeUtil from '@/utils/treeUtil'

export default {
  name: 'edit',
  data() {
    return {
      treeSingleData: [],
      treeIds: [],
      options: [],
      id: '',
      form: {
        tags: [],
        categories: []
      },
      tagInputVisible: false,
      tagInputValue: '',
      categoryInputVisible: false,
      categoryInputValue: '',
      rules: {
        title: [
          {required: true, message: '请输入活动名称', trigger: ['blur', 'change']},
          {min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: ['blur', 'change']}
        ],
        treeId: [
          {required: true, message: '请选择文章所属结构', trigger: ['blur', 'change']}
        ],
        tags: [
          {type: 'array', message: '请输入至少一个标签名', trigger: ['blur', 'change']}
        ],
        categories: [
          {type: 'array', message: '请输入至少一个分类名', trigger: ['blur', 'change']}
        ]
      }
    }
  },
  computed: {
    ...mapState(['userId', 'tagList', 'categoryList'])
  },
  watch: {
    $route: 'routerChange'
  },
  methods: {
    async routerChange() {
      this.id = this.$route.params.id
      await this.getTreeList()
      if (this.id) { // 修改文章
        this.getArticleInfo() // 获取文章详情
        // } else { // 新增文章
        this.$store.dispatch('fetchTagList', {})
        this.$store.dispatch('fetchCategoryList', {})
      }
    },
    async init() {
      this.routerChange()
    },
    async getArticleInfo() {
      let result = await this.api.getArticleById(this.id)
      this.treeIds = [result.treeId]

      let findParentId = (id) => {
        this.treeSingleData.forEach(v => {
          if (v.id == id && v.parentId !== 1) {
            this.treeIds.unshift(v.parentId)
            findParentId(v.parentId)
          }
        })
      }

      findParentId(result.treeId)

      console.log(this.treeIds)
      result.tags = result.tags.map(v => {
        v = v.name
        return v
      })
      result.categories = result.categories.map(v => {
        v = v.name
        return v
      })
      let arr = ['title', 'treeId', 'tags', 'categories', 'content']
      arr.forEach(v => {
        this.$set(this.form, v, result[v])
      })
      // this.form = result
    },
    async onSubmit() {
      if (this.id) {
        this.updateArticle()
      } else {
        this.addArticle()
      }
    },
    async updateArticle() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        let form = JSON.parse(JSON.stringify(this.form))
        delete form.createdAt
        delete form.updatedAt
        delete form.id
        delete form.viewCount
        delete form.comments
        let res = await this.api.updateArticleById({
          id: this.id,
          content: form
        })
        if (res.code == 0) {
          this.showMsg('更新完成')
          this.$router.push('/admin/article/manager')
        }
      })
    },
    async addArticle() {
      this.$refs['form'].validate(async (valid) => {
        if (!this.form.content) return this.showMsg('请输入文章内容', 'error')
        let form = JSON.parse(JSON.stringify(this.form))
        form.authorId = this.userId
        form.tagList = this.id ? form.tags.map(v => v.name) : form.tags
        form.categoryList = this.id ? form.categories.map(v => v.name) : form.categories
        delete form.tags
        delete form.categories
        if (valid) {
          let res = await this.api.addArticle(form)
          if (res.code == 0) {
            this.showMsg('新增完成')
            this.$router.push('/admin/article/manager')
          }
        }
      })
    },
    async getTreeList() {
      let res = await this.api.getTreeList()
      this.treeSingleData = res.list
      if (res.code == 0) {
        let arr = res.list.map(v => {
          v.label = v.name
          v.value = v.id
          return v
        })
        this.options = treeUtil.toList(arr)[0].children
      }
    },
    handleChange(value) {
      this.$set(this.form, 'treeId', this.treeIds[this.treeIds.length - 1])
      console.log(value)
    },
    handleClose(item, type) {
      let target = type == 'tag' ? 'tags' : 'categories'
      this.form[target].splice(this.form[target].indexOf(item), 1)
    },

    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    showCategoryInput() {
      this.categoryInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveCategoryInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let tagInputValue = this.tagInputValue
      if (tagInputValue) {
        this.form.tags.push({name: tagInputValue})
      }
      this.tagInputVisible = false
      this.tagInputValue = ''
    },

    handleCategoryInputConfirm() {
      let categoryInputValue = this.categoryInputValue
      if (categoryInputValue) {
        this.form.categories.push({name: categoryInputValue})
      }
      this.categoryInputVisible = false
      this.categoryInputValue = ''
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
  .edit {
  }
</style>

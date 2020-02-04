<template>
  <div class="tree">
    <div class="tree-left">
      <h2>文章目录结构</h2>
      <el-tree :data="treeData"
               node-key="id"
               :default-expand-all="false"
               :default-expanded-keys="expandedKeys"
               :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <div class="tree-label" :class="{useless: !node.data.status}"
             @click="nodeClicked(node, data)">
          <i class="el-icon-folder-opened"></i>
          {{ node.label }} <span v-if=" !node.data.status "> 已禁用</span>
        </div>
        <div class="tree-btns">
          <el-button type="text" size="mini" @click="() => append(data)" v-if="node.data.id == 1">新增</el-button>
          <el-button type="text" size="mini" @click="() => update(node, data)" v-if="node.data.id != 1">修改</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)" v-if="node.data.id != 1">删除</el-button>
        </div>
      </span>
      </el-tree>
    </div>
    <div class="tree-right">
      <h2 class="ml25">{{btnFlag=='add'?'新增节点':'修改节点'}}</h2>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="父节点" prop="parentId">
          <el-input v-model="form.parentName" style="width:50%;" placeholder="点选左侧树结构节点" readonly></el-input>
          <el-input v-model="form.parentId" style="width:50%; visibility: hidden;"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" style="width:50%;" placeholder="长度在 3 到 10 个字符"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="btnFlag == 'update'">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用"></el-switch>
        </el-form-item>

        <el-form-item class="mt20">
          <el-button type="primary" @click="onSubmit">{{btnFlag == 'add' ? '新增' : '修改'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import treeUtil from '@/utils/treeUtil'

export default {
  name: 'tree',
  data() {
    return {
      ss: true,
      form: {
        name: '',
        parentId: '',
        parentName: ''
      },
      treeSingleData: [],
      treeData: [],
      expandedKeys: [1],
      rules: {
        parentId: [
          {required: true, message: '请选择父节点', trigger: ['blur', 'change']}
        ],
        name: [
          {required: true, message: '请输入标题', trigger: ['blur']},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur']}
        ]
      },
      // 被点击的节点（新增，修改，删除）
      targetNode: {},
      btnFlag: 'add'
    }
  },
  computed: {
    ...mapState(['tagList', 'categoryList', 'articleList'])
  },
  methods: {
    async init() {
      let res = await this.api.getTreeList()
      // {includeArticle: true}
      // let single = treeUtil.toSingle(res)
      let list = res.list
      list = list.map(v => {
        v.label = v.name
        return v
      })
      this.treeSingleData = list
      this.treeData = treeUtil.toList(list)
      if (this.targetNode) {
        this.expandedKeys.push(this.targetNode.id)
      } else {
        this.expandedKeys = [1]
      }
    },
    append(data) {
      this.form = {
        name: '',
        parentId: '',
        parentName: ''
      }
      this.btnFlag = 'add'
    },
    update(node, data) {
      console.log(node)
      this.targetNode = data
      this.btnFlag = 'update'
      this.form = data
      if (!data.parentId) { // 第一级别
        this.$set(this.form, 'parentId', 0)
        this.$set(this.form, 'parentName', '根节点')
      } else {
        this.$set(this.form, 'parentId', node.parent.data.id)
        this.$set(this.form, 'parentName', node.parent.data.label)
      }
    },
    remove(node, data) {
      console.log(data.id)
      let children = 0
      this.treeSingleData.forEach(v => {
        if (v.parentId == data.id) {
          ++children
        }
      })
      if (children) return this.showMsg(`该节点拥有 ${children} 个子节点,不能进行删除`, 'error')
      this.$confirm('将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.api.deleteTreeById(data.id)
        if (res.code == 0) {
          this.showMsg('删除成功')
          this.init()
        }
      }).catch(() => {
      })
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
    },
    nodeClicked(node, data) {
      this.targetNode = data
      this.form.parentId = data.id
      this.form.parentName = data.label
    },
    async getArticleInfo() {
      let result = await this.api.getArticleById(this.id)
      this.form = result
    },
    async onSubmit() {
      if (this.btnFlag == 'update') {
        this.updateArticle()
      } else {
        this.addArticle()
      }
    },
    async updateArticle() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        let form = {}
        form.id = this.form.id
        form.parentId = this.form.parentId
        form.name = this.form.name
        form.status = this.form.status
        let res = await this.api.updateTreeNode(form)
        if (res.code == 0) {
          this.showMsg('更新完成')
          this.init()
        }
      })
    },
    async addArticle() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let form = {}
          form.parentId = this.form.parentId
          form.name = this.form.name
          let res = await this.api.addTreeNode(form)
          if (res.code == 0) {
            this.init()
            this.form = {
              name: '',
              parentId: '',
              parentName: ''
            }
          } else {
            this.showMsg(res.msg, 'warning')
          }
          // form.id = parseInt(Math.random() * 1000)
          // form.children = []
          // form.label = form.name
          // if (!this.targetNode.children) {
          //   this.$set(this.targetNode, 'children', [])
          // }
          // this.targetNode.children.push(form)
          // let res = await this.api.addArticle(form)
          // if (res.code == 0) {
          //   this.showMsg('新增完成')
          //   this.$router.push('/admin/article/manager')
          // }
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss">
  .tree {
    display: flex;
    min-height: 100%;
    .tree-left {
      width: 300px;
      min-height: 100%;
      .el-tree-node__content {
        height: 32px;
        .custom-tree-node {
          width: 100%;
          display: flex;
          justify-content: space-between;
          height: 32px;
          .tree-label {
            box-sizing: border-box;
            font-size: 14px;
            line-height: 30px;
            height: 30px;
            min-width: 80px;
            text-indent: 2px;
            & > i {
              color: #ff9800;
            }
            &.useless {
              color: #F56C6C;
              text-decoration: line-through;
            }
            &:hover {
              color: #ff6580;
              font-weight: bold;
            }
          }
          .tree-btns {
          }
        }
      }
    }
    .tree-right {
      flex: 1;
    }
  }
</style>

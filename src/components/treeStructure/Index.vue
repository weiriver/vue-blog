<template>
  <div class="tree-structure">
    <el-tree :data="treeData"
             node-key="id"
             accordion
             :default-expand-all="false"
             :default-expanded-keys="expandedKeys"
             :expand-on-click-node="true">
      <span class="tc-node" slot-scope="{ node, data }">
        <div class="tree-label" :class="{'tree-article': data.articleId}" @click="nodeClicked(node, data)"
             :title="node.label"
        >
          <i class="el-icon-folder-opened" v-if="!data.articleId"></i>
          <i class="el-icon-document" v-if="data.articleId"></i>
          {{ node.label }}
        </div>
      </span>
    </el-tree>
  </div>
</template>
<script>
import treeUtil from '@/utils/treeUtil'

export default {
  name: 'tree-structure',
  props: {},
  data() {
    return {
      treeData: [],
      expandedKeys: [1]
    }
  },
  methods: {
    async init() {
      let res = await this.api.getTreeList({includeArticle: true, status: true})
      let children = []
      let orginArr = res.list.map(v => {
        v.label = v.name
        if (v.articles && v.articles.length) {
          let arr = v.articles.map(v => {
            v.parentId = v.treeId
            v.name = v.label = v.title
            v.articleId = v.id
            delete v.title
            delete v.treeId
            delete v.id
            return v
          })
          children.push(...arr)
        }
        delete v.articles
        return v
      })
      if (res.articleList && res.articleList.length) {
        let arr = res.articleList.map(v => {
          v.parentId = v.treeId
          v.name = v.label = v.title
          v.articleId = v.id
          delete v.title
          delete v.treeId
          delete v.id
          return v
        })
        children.push(...arr)
      }
      orginArr = [...orginArr, ...children]
      if (res.code == 0) {
        this.treeData = treeUtil.toList(orginArr)[0].children
      }
    },
    nodeClicked(node, data) {
      if (data.articleId) this.$router.push(`/article/${data.articleId}`)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss">
  .el-drawer.ltr {
    height: 100%;
    overflow: auto;
  }

  .tree-structure {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;

    .el-tree-node__content {
      height: 36px;

      .tc-node {
        color: black;
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 36px;

        .tree-label {
          box-sizing: border-box;
          font-size: 14px;
          line-height: 34px;
          height: 34px;
          text-indent: 2px;
          & > i {
            color: #ff9800;
          }
          &.tree-article {
            color: #666666;
            font-size: 12px;
            max-width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:hover {
            color: #ff6580;
          }
        }

      }
    }

  }
</style>

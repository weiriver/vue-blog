<template>
  <div class="pagination">
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page.sync="form.page"
                   :page-size="form.pageSize"
                   :page-sizes="[10, 20, 50, 100, 200]"
                   background
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
  </div>
</template>
<script>
import {Pagination} from 'element-ui'
import {mapState} from 'vuex'

export default {
  props: {
    totalCount: {
      type: Number,
      default: 20
    },
    pageSize: {
      type: Number,
      default: 10
    },
    actionTarget: {
      type: String,
      default: ''
    },
    serachForm: {
      type: Object,
      default: () => {
        return {
          page: 1,
          pageSize: 10
        }
      }
    }
  },
  data() {
    return {
      form: {
        page: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapState(['resetPage'])
  },
  watch: {
    resetPage(val) {
      if (val) this.$set(this.form, 'page', 1)
    }
  },
  methods: {
    init() {
      this.handleSearch()
      // this.Event.$on('pageInit', (val) => {
      //   this.form.page = val
      // })
    },
    handleCurrentChange(val) {
      // this.Event.$emit('pagechange', val)
      if (val != 1) this.$store.commit('SET_DATA', {target: 'resetPage', content: false}) // 防止重置页码为1
      this.handleSearch()
      this.form.page = val
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.form.pageSize = val
      this.handleSearch()
      // this.Event.$emit('pageSizeChange', val)
    },
    handleSearch() {
      if (this.resetPage) this.form.page = 1
      let data = Object.assign({}, this.serachForm, this.form)
      console.log(data)
      this.$store.dispatch(this.actionTarget, data)
    }
  },
  beforeDestroy() {
    // this.Event.$off('pageInit')
    // this.Event.$off('pagechange')
  },
  // deactivated() {
  //   // this.Event.$off('pageInit')
  //   // this.Event.$off('pagechange')
  // },
  mounted() {
    this.init()
  },
  components: {ElPagination: Pagination}
}
</script>
<style lang="scss">
  .pagination {
    text-align: right;
    padding: 10px 0;
  }

  /* 重置样式，尽量和iview_ui样式靠拢 */
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background-color: #fff;
    color: #606266;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
    font-weight: normal;
  }
</style>

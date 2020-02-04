<template>
  <el-dialog title='登 录' :visible.sync="loginDialogFormVisible"
             center width="400px">
    <div class="login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="68px">
        <el-form-item label="用户名" prop="account">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-button placeholder="请输入账户名" type="primary" @click="submitForm('ruleForm')" class="width100"
                   :loading="loading">{{loading ? '正在登陆中...' : '登录'}}
        </el-button>
        <br>
        <el-button placeholder="请输入密码" type="info" @click="githubLogin" class="mt10 width100">github登录
        </el-button>
      </el-form>
    </div>
  </el-dialog>

</template>
<script>
import {mapMutations} from 'vuex'

export default {
  name: 'login',
  components: {},
  data() {
    return {
      loginDialogFormVisible: false,
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapMutations({
      SET_DATA: 'SET_DATA'
    }),
    githubLogin() {
      this.showMsg('未完成,敬请期待！', 'warning')
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let res = await this.api.login(this.ruleForm)
          let arr = ['token', 'role', 'username', 'userId']
          arr.forEach(v => {
            this.SET_DATA({target: v, content: res[v]})
          })
          this.loading = this.loginDialogFormVisible = false
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/home')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog title='注 册' :visible.sync="registerDialogFormVisible" center width="460px">
    <div class="login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpsw">
          <el-input type="password" v-model="ruleForm.checkpsw" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-button placeholder="请输入账户名" type="primary" @click="submitForm('ruleForm')" class="width100"
                   :loading="loading">{{loading ? '正在注册中...' : ' 注 册 '}}
        </el-button>
        <br>
        <el-button placeholder="请输入密码" type="info" @click="githubLogin" class="mt10 width100"> github 登录
        </el-button>
      </el-form>
    </div>
  </el-dialog>

</template>
<script>
import {mapMutations} from 'vuex'

export default {
  name: 'register',
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerDialogFormVisible: false,
      ruleForm: {
        username: '',
        password: '',
        checkpsw: '',
        email: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
        ],
        checkpsw: [
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
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
          let obj = JSON.parse(JSON.stringify(this.ruleForm))
          delete obj.checkpsw
          let res = await this.api.register(obj)
          this.loading = false
          if (res.code == 0) {
            this.registerDialogFormVisible = false
            this.showMsg('注册成功')
          } else {
            this.showMsg(res.msg, 'warning')
          }
          // this.$router.push('/login')
        } else {
          return false
        }
      })
    }
  }
}
</script>

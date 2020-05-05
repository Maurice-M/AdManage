<template>
  <div class="login_bg">
    <div class="login_box">
      <div class="logo_box">
        <img src="../assets/logo.png" alt="AD" />
      </div>
      <div class="info_box">
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" clearable>
              <i slot="prefix" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password>
              <i slot="prefix" class="el-icon-goods"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" class="btn" @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: 'wangxm1135@163.com',
        password: '123456'
      },
      loginFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在6-18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('api/user/login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_bg {
  height: 100%;
  background-color: #444;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.logo_box {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
  }
}
.info_box {
  padding: 90px 15px 20px;
}
.btn {
  width: 100%;
}
</style>
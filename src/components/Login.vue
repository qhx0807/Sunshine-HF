<template>
  <div class="login">
    <div class="wrap">
      <div class="login-img">
        <img src="../assets/login-img.png">
      </div>
      <div class="login-box">
        <div class="login-logo">
          <a href="#"><img src="../assets/login_logo.png" alt=""></a>
        </div>
        <div class="login-name">
          <p>后台管理系统</p>
        </div>
        <div class="login-form">
          <Form :model="formItem">
            <FormItem>
              <Input v-model="formItem.name" placeholder="用户名"/>
            </FormItem>
            <FormItem>
              <Input type="password" v-model="formItem.password" @on-enter="loginHandler" placeholder="密码"/>
            </FormItem>
            <FormItem>
              <input class="logincode" type="text" v-model="formItem.code" placeholder="请输入验证码"/>
              <a class="btncode" @click.stop="onClickSendCode">{{btntext}}</a>
            </FormItem>
            <FormItem>
              <Button type="info" :loading="loading" @click="loginHandler" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      loading: false,
      formItem: {
        name: '',
        password: '',
        code: ''
      },
      btntext: '发送验证码',
      issend: false,
      timer: null
    }
  },
  computed: {

  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    loginHandler () {
      if (!this.formItem.name) {
        this.$Message.warning('请输入用户名')
        return false
      }
      if (!this.formItem.password) {
        this.$Message.warning('请输入用户密码')
        return false
      }
      if (!this.formItem.code) {
        this.$Message.warning('请输入验证码')
        return false
      }
      let expression = localStorage.getItem('expression')
      let code = localStorage.getItem('code')
      let d = new Date().valueOf
      if (Number(expression) <= d) {
        this.$Message.warning('验证码已过期！')
        return false
      }
      if (this.formItem.code != code) {
        this.$Message.warning('验证码错误！')
        return false
      }
      this.loading = true
      axios({
        method: 'post',
        url: apiUrl + '/login',
        data: {
          name: this.formItem.name,
          pwd: this.formItem.password
        }
      }).then(response => {
        this.loading = false
        if (response.data.Data) {
          sessionStorage.setItem('name', this.formItem.name)
          sessionStorage.setItem('id', response.data.Data._id)
          this.$Message.success('登录成功！')
          localStorage.removeItem('code')
          localStorage.removeItem('expression')
          this.$router.replace({name: 'Message'})
        } else {
          this.$Message.warning('用户名或密码错误！')
        }
      }).catch(error => {
        this.loading = false
        this.$Message.error('登录失败，请检查网络！')
        console.log(error)
      })
    },
    onClickSendCode () {
      if (!this.formItem.name) {
        this.$Message.warning('请先输入用户名！')
        return false
      }
      if (this.issend) {return false}
      axios.get(apiUrl + '/logincode?name=' + this.formItem.name)
        .then(response => {
          console.log(response)
          if (response.data.code) {
            localStorage.setItem('code', response.data.code)
            localStorage.setItem('expression', response.data.expression)
            this.issend = true
            var time = 120
            this.timer = setInterval(() => {
              if (time>0) {
                time -= 1
                this.btntext = `${time}s后重新发送`
              } else {
                this.issend = false
                this.btntext = '发送验证码'
              }
            }, 1000)
          } else {
            this.$Message.warning(response.data.msg)
          }
        })
        .catch(error => {
          console.log(error)
          this.$Message.error('操作失败，请检查网络！')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #93defe;
  .wrap{
    width: 1100px;
    margin: 120px auto 0;
    .login-img{
      float: left;
      width: 432px;
      height: 440px;
      margin-left: 50px;
      img{
        width: 500px;
        height: 440px;
      }
    }
    .login-box{
        height: 360px;
        width: 400px;
        padding: 50px;
        background-color: #ffffff;
        border-radius: 6px;
        box-sizing: border-box;
        float: right;
        margin-right: 50px;
        position: relative;
        margin-top: 50px;
        .login-logo{
          width: 120px;
          height: 120px;
          border: 5px solid #93defe;
          border-radius: 100px;
          background: #fff;
          text-align: center;
          line-height: 110px;
          position: absolute;
          top: -60px;
          right: 140px;
          img{
            width: 60px;
            height: 60px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        .login-name{
            width: 100%;
            float: left;
            text-align: center;
            margin-top: 20px;
            p{
              width: 100%;
              text-align: center;
              font-size: 18px;
              color: #444;
              padding: 10px 0 20px;
            }
        }
    }
    .logincode{
      border: none;
      outline: none;
      border-bottom: 1px solid #ddd;
      width: 100%;
      &:focus{
        border-bottom: 1px solid skyblue;
      }
    }
    .btncode{
      position: absolute;
      right: 10px;
      top: 3px;
    }
  }
}
</style>

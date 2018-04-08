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
              <Input v-model="formItem.password" @on-enter="loginHandler" placeholder="密码"/>
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
        password: ''
      }
    }
  },
  methods: {
    loginHandler () {
      if (!this.formItem.name) {
        this.$Message.info('请输入用户名')
        return false
      }
      if (!this.formItem.password) {
        this.$Message.info('请输入用户密码')
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
          this.$router.replace({name: 'Message'})
        } else {
          this.$Message.info('用户名或密码错误！')
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
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
  }
}
</style>

<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="1-1" theme="dark" width="auto"  @on-select="onClickMenu" :class="menuitemClasses">
                    <MenuItem name="" class="logo"/>
                    <MenuItem name="Message">
                      <Icon type="ios-list"></Icon>
                      <span>留言管理</span>
                    </MenuItem>
                    <MenuItem name="House">
                      <Icon type="social-buffer"></Icon>
                      <span>小区数据</span>
                    </MenuItem>
                    <MenuItem name="Market">
                      <Icon type="settings"></Icon>
                      <span>商场数据</span>
                    </MenuItem>
                    <MenuItem name="Log">
                      <Icon type="ios-cloud-upload"></Icon>
                      <span>请求日志</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0', cursor: 'pointer'}" type="navicon-round" size="24"></Icon>
                    <div class="avatar">
                      <Avatar style="background-color: #eee" icon="person" />
                      <Dropdown @on-click="onClickDropdown">
                        <span class="username">Admin</span>
                        <DropdownMenu slot="list">
                          <DropdownItem name="updateUser">修改密码</DropdownItem>
                          <DropdownItem name="logout">退出登录</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '660px'}">
                    <router-view/>
                </Content>
            </Layout>
        </Layout>
      <Modal v-model="modalShow" width="360">
        <p slot="header" style="text-align:center">
          <span>修改密码</span>
        </p>
        <div style="text-align:center">
          <Form>
            <FormItem>
              <Input type="text" v-model="newpwd" placeholder="请输入新密码"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" long :loading="loading" @click="updateUser">保存</Button>
        </div>
      </Modal>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Main',
  data () {
    return {
      isCollapsed: true,
      modalShow: false,
      newpwd: '',
      loading: false
    }
  },
  computed: {
    rotateIcon () {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses () {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    onClickMenu (e) {
      if (e) this.$router.push({ name: e })
    },
    onClickDropdown (e) {
      if (e === 'updateUser') {
        this.modalShow = true
      } else if (e === 'logout') {
        this.$router.replace({name: 'Login'})
      }
    },
    updateUser () {
      if (!this.newpwd) {
        this.$Message.info('请输入！')
        return false
      }
      let obj = {
        id: sessionStorage.id,
        name: sessionStorage.name,
        pwd: this.newpwd
      }
      axios.put(apiUrl + '/updateUser', obj)
          .then(response => {
          console.log(response)
          this.loading = false
          if(response.data.OK === 'ok'){
            this.$Message.info('修改成功！请重新登录~~')
            this.modalShow = false
            this.$router.replace({name: 'Login'})
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.logo{
  height: 64px;
  background: #5b6270;
}
.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
  height: 100%;
}
.ivu-layout {
  height: 100%;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
  cursor: pointer;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.avatar{
  float: right;
  margin-right: 40px;
}
.username{
  font-size: 14px;
  font-weight: 500;
  padding-left: 3px;
}
</style>
